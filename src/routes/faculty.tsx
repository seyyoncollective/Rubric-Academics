import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations_supabase/client";
import { isFacultyAuthed, setFacultyAuthed } from "@/lib/portal-auth";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, ArrowLeft, CheckCircle2, XCircle, Save, ChevronRight, Calendar, History } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { syncAttendanceSheetFn } from "@/lib/api/sync-attendance-sheet.functions";

export const Route = createFileRoute("/faculty")({
  head: () => ({ meta: [{ title: "Faculty Attendance Portal — Rubric Academics" }, { name: "robots", content: "noindex" }] }),
  component: FacultyPage,
});

type Faculty = { id: string; name: string };
type Student = { id: string; name: string };
type Record = { id: string; faculty_id: string; student_id: string; date: string; status: "present" | "absent" };

const today = () => new Date().toISOString().slice(0, 10);

function FacultyPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [absent, setAbsent] = useState<Set<string>>(new Set());
  const [date, setDate] = useState(today());
  const [history, setHistory] = useState<Record[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // ── Trace helper ──────────────────────────────────────────────────────────
  const log = useCallback((label: string, payload: unknown) => {
    console.log(`[FACULTY_PAGE] ${label}:`, payload, "@", new Date().toISOString());
  }, []);

  // ── Fetch faculties on mount ──────────────────────────────────────────────
  const fetchFaculties = useCallback(async () => {
    log("starting fetchFaculties", { authed: isFacultyAuthed() });

    const { data, error } = await supabase
      .from("faculties")
      .select("*")
      .order("name");

    log("faculties query result", { data, error });

    if (error) {
      console.error("[FACULTY_PAGE] Error fetching faculties:", error.message, error);
      toast.error("Failed to load faculty list: " + error.message);
      return;
    }

    if (!data || data.length === 0) {
      log("faculties query returned EMPTY — no faculties exist in DB", { data });
      setFaculties([]);
      return;
    }

    log("faculties loaded successfully", { count: data.length, names: data.map((f: { name: string }) => f.name) });
    setFaculties(data);
  }, [log]);

  useEffect(() => {
    if (!isFacultyAuthed()) {
      log("not authed, redirecting to login", {});
      navigate({ to: "/faculty-login" });
      return;
    }
    log("component ready, starting data fetch", {});
    setReady(true);
    fetchFaculties();
  }, [navigate, fetchFaculties, log]);

  useEffect(() => {
    if (!selected) {
      log("selected faculty cleared, resetting students & attendance", {});
      setStudents([]);
      setAbsent(new Set());
      return;
    }
    (async () => {
      log("fetching students for faculty_id", { selected });

      const { data: links, error: linksError } = await supabase
        .from("faculty_students")
        .select("student_id")
        .eq("faculty_id", selected);

      log("faculty_students result", { links, error: linksError });
      if (linksError) {
        console.error("[FACULTY_PAGE] Error fetching faculty_students:", linksError.message, linksError);
        toast.error("Failed to load student assignments");
        return;
      }

      const ids = (links ?? []).map(l => l.student_id);
      log("student IDs from faculty_students", { count: ids.length, ids });

      if (ids.length === 0) {
        log("no students assigned to this faculty", {});
        setStudents([]);
        setAbsent(new Set());
        return;
      }

      const { data: studs, error: studsError } = await supabase
        .from("students")
        .select("*")
        .in("id", ids)
        .order("name");

      log("students query result", { count: studs?.length ?? 0, data: studs, error: studsError });
      if (studsError) {
        console.error("[FACULTY_PAGE] Error fetching students:", studsError.message, studsError);
        toast.error("Failed to load student list");
        return;
      }

      setStudents(studs ?? []);

      // Prefill from existing attendance for the date
      const { data: existing, error: existingError } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("faculty_id", selected)
        .eq("date", date);

      log("existing attendance records", { count: existing?.length ?? 0, data: existing, error: existingError });
      if (existingError) {
        console.error("[FACULTY_PAGE] Error fetching attendance:", existingError.message, existingError);
      }

      setAbsent(new Set((existing ?? []).filter(r => r.status === "absent").map(r => r.student_id)));
      log("absent set built", { absentCount: (existing ?? []).filter(r => r.status === "absent").length });
    })();
  }, [selected, date, log]);

  const logout = () => {
    log("user logging out", {});
    setFacultyAuthed(false);
    navigate({ to: "/" });
  };

  const toggle = (id: string) => {
    setAbsent(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  async function save() {
    if (!selected) {
      log("save attempted WITHOUT selected faculty — blocked", {});
      toast.error("Please select a faculty first");
      return;
    }
    // Clear existing records for that faculty + date, then re-insert
    await supabase.from("attendance_records").delete().eq("faculty_id", selected).eq("date", date);
    const rows = students.map(s => ({
      faculty_id: selected, student_id: s.id, date,
      status: absent.has(s.id) ? "absent" : "present",
      recorded_by: faculties.find(f => f.id === selected)?.name ?? null,
    }));
    log("saving attendance", { facultyId: selected, date, rowCount: rows.length });
    if (rows.length) {
      const { error } = await supabase.from("attendance_records").insert(rows);
      if (error) {
        console.error("[FACULTY_PAGE] Error saving attendance:", error.message, error);
        return toast.error(error.message);
      }
      log("attendance saved successfully", { present: students.length - absent.size, absent: absent.size });
    }
    toast.success(`Attendance saved · ${students.length - absent.size} present, ${absent.size} absent`);

    // ── Non-blocking Google Sheets sync ──────────────────────────────────
    syncAttendanceSheetFn()
      .then((result) => {
        log("google sheets sync result", result);
        if (!result.success) {
          console.warn("[FACULTY_PAGE] Google Sheets sync warning:", result.error);
          toast.warning("Attendance saved, but sheet sync failed: " + (result.error || "Unknown"));
        }
      })
      .catch((err) => {
        console.error("[FACULTY_PAGE] Google Sheets sync error:", err);
        // Non-blocking — attendance is already safe in Supabase
      });
  }

  async function loadHistory() {
    if (!selected) {
      log("loadHistory called without selected faculty — blocked", {});
      return;
    }
    log("loading attendance history for faculty", { selected });
    const { data, error } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("faculty_id", selected)
      .order("date", { ascending: false })
      .limit(200);

    log("history query result", { count: data?.length ?? 0, error });
    if (error) {
      console.error("[FACULTY_PAGE] Error loading history:", error.message, error);
      toast.error("Failed to load attendance history");
      return;
    }

    setHistory((data ?? []) as Record[]);
    setShowHistory(true);
  }

  const historyGrouped = useMemo(() => {
    const map = new Map<string, { present: number; absent: number }>();
    history.forEach(r => {
      const cur = map.get(r.date) ?? { present: 0, absent: 0 };
      cur[r.status] += 1;
      map.set(r.date, cur);
    });
    return Array.from(map.entries());
  }, [history]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="bg-card border-b sticky top-0 z-30 shadow-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent/70 text-white"><BookOpen className="h-5 w-5" /></div>
            <div className="min-w-0">
              <h1 className="font-display font-bold truncate">Faculty Attendance</h1>
              <p className="text-xs text-muted-foreground">Rubric Academics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden sm:inline-flex"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Site</Button></Link>
            <Button variant="outline" size="sm" onClick={logout}><LogOut className="h-4 w-4 mr-1" /> Logout</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {!selected ? (
          <>
            <h2 className="text-2xl font-display font-bold mb-2">Select a Faculty</h2>
            <p className="text-muted-foreground mb-6">Choose your name to record attendance for today's class.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {faculties.map(f => (
                <button key={f.id} onClick={() => setSelected(f.id)}
                  className="group rounded-2xl bg-card p-5 ring-1 ring-border shadow-card hover:shadow-elegant transition-all hover:-translate-y-0.5 flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-hero text-white font-bold text-lg">
                      {f.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{f.name}</div>
                      <div className="text-xs text-muted-foreground">Tap to open</div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="min-w-0">
                <button onClick={() => { setSelected(null); setShowHistory(false); }} className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
                  <ArrowLeft className="h-3.5 w-3.5" /> Change faculty
                </button>
                <h2 className="text-2xl font-display font-bold truncate">{faculties.find(f => f.id === selected)?.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    className="pl-9 h-10 rounded-md border border-input bg-card px-3 text-sm" />
                </div>
                <Button variant="outline" size="sm" onClick={loadHistory}><History className="h-4 w-4 mr-1" /> History</Button>
              </div>
            </div>

            {students.length === 0 ? (
              <div className="rounded-2xl bg-card ring-1 ring-border p-10 text-center">
                <p className="text-muted-foreground">No students assigned yet. Please contact the admin.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-3 mb-5">
                  <SummaryCard label="Total" value={students.length} tone="default" />
                  <SummaryCard label="Present" value={students.length - absent.size} tone="success" />
                  <SummaryCard label="Absent" value={absent.size} tone="destructive" />
                </div>

                <div className="rounded-2xl bg-card ring-1 ring-border shadow-card p-4 sm:p-5">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {students.map(s => {
                      const isAbsent = absent.has(s.id);
                      return (
                        <div key={s.id}
                          className={`flex items-center justify-between gap-3 rounded-lg px-3 py-3 ring-1 transition-all ${isAbsent ? "bg-destructive/10 ring-destructive/30" : "bg-success/5 ring-success/20"}`}>
                          <span className="truncate font-medium">{s.name}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            {isAbsent
                              ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive"><XCircle className="h-4 w-4" /> Absent</span>
                              : <span className="inline-flex items-center gap-1 text-xs font-semibold text-success"><CheckCircle2 className="h-4 w-4" /> Present</span>}
                            <Switch
                              checked={isAbsent}
                              onCheckedChange={() => toggle(s.id)}
                              aria-label={`Mark ${s.name} absent`}
                              className="data-[state=checked]:bg-destructive data-[state=unchecked]:bg-success"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-5 flex justify-end">
                    <Button onClick={save} size="lg" className="bg-primary hover:bg-primary/90"><Save className="h-4 w-4 mr-1.5" /> Save Attendance</Button>
                  </div>
                </div>

                {showHistory && (
                  <div className="mt-6 rounded-2xl bg-card ring-1 ring-border shadow-card p-5">
                    <h3 className="font-display font-bold mb-3">Attendance History</h3>
                    {historyGrouped.length === 0 ? <p className="text-sm text-muted-foreground">No history yet.</p> : (
                      <ul className="divide-y">
                        {historyGrouped.map(([d, c]) => (
                          <li key={d} className="flex items-center justify-between py-2.5 text-sm">
                            <span className="font-medium">{d}</span>
                            <span className="flex gap-3">
                              <span className="text-success">✓ {c.present}</span>
                              <span className="text-destructive">✗ {c.absent}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: "default" | "success" | "destructive" }) {
  const styles = tone === "success" ? "bg-success/10 text-success ring-success/20"
    : tone === "destructive" ? "bg-destructive/10 text-destructive ring-destructive/20"
    : "bg-primary/10 text-primary ring-primary/20";
  return (
    <div className={`rounded-2xl p-5 ring-1 ${styles}`}>
      <p className="text-3xl font-bold font-display">{value}</p>
      <p className="text-xs uppercase tracking-wider opacity-80">{label}</p>
    </div>
  );
}
