import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations_supabase/client";
import { isAdminAuthed, setAdminAuthed } from "@/lib/portal-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck, LogOut, Plus, Trash2, Users, GraduationCap, UserPlus, ArrowLeft, Search, Check, X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Rubric Academics" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Faculty = { id: string; name: string };
type Student = { id: string; name: string };
type Assignment = { id: string; faculty_id: string; student_id: string };

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [tab, setTab] = useState<"faculties" | "students">("faculties");
  const [newFaculty, setNewFaculty] = useState("");
  const [newStudent, setNewStudent] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAdminAuthed()) { navigate({ to: "/admin-login" }); return; }
    setReady(true);
    load();
  }, [navigate]);

  async function load() {
    const [f, s, a] = await Promise.all([
      supabase.from("faculties").select("*").order("name"),
      supabase.from("students").select("*").order("name"),
      supabase.from("faculty_students").select("*"),
    ]);
    if (f.data) setFaculties(f.data);
    if (s.data) setStudents(s.data);
    if (a.data) setAssignments(a.data);
  }

  const logout = () => { setAdminAuthed(false); navigate({ to: "/" }); };

  const assignedIds = useMemo(() => {
    if (!selectedFaculty) return new Set<string>();
    return new Set(assignments.filter(a => a.faculty_id === selectedFaculty).map(a => a.student_id));
  }, [assignments, selectedFaculty]);

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  async function addFaculty() {
    const name = newFaculty.trim();
    if (!name) return;
    const { error } = await supabase.from("faculties").insert({ name });
    if (error) return toast.error(error.message);
    setNewFaculty(""); toast.success("Faculty added"); load();
  }
  async function removeFaculty(id: string) {
    if (!confirm("Remove this faculty? Their assignments will be cleared.")) return;
    const { error } = await supabase.from("faculties").delete().eq("id", id);
    if (error) return toast.error(error.message);
    if (selectedFaculty === id) setSelectedFaculty(null);
    toast.success("Faculty removed"); load();
  }
  async function addStudent() {
    const name = newStudent.trim();
    if (!name) return;
    const { error } = await supabase.from("students").insert({ name });
    if (error) return toast.error(error.message);
    setNewStudent(""); toast.success("Student added"); load();
  }
  async function removeStudent(id: string) {
    if (!confirm("Remove this student from the master database?")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Student removed"); load();
  }
  async function toggleAssign(studentId: string) {
    if (!selectedFaculty) return;
    const exists = assignments.find(a => a.faculty_id === selectedFaculty && a.student_id === studentId);
    if (exists) {
      const { error } = await supabase.from("faculty_students").delete().eq("id", exists.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("faculty_students").insert({ faculty_id: selectedFaculty, student_id: studentId });
      if (error) return toast.error(error.message);
    }
    load();
  }

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="bg-card border-b sticky top-0 z-30 shadow-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-hero text-white"><ShieldCheck className="h-5 w-5" /></div>
            <div className="min-w-0">
              <h1 className="font-display font-bold truncate">Admin Portal</h1>
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
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <Stat icon={<Users className="h-5 w-5" />} label="Faculties" value={faculties.length} />
          <Stat icon={<GraduationCap className="h-5 w-5" />} label="Students" value={students.length} />
          <Stat icon={<UserPlus className="h-5 w-5" />} label="Assignments" value={assignments.length} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <TabBtn active={tab === "faculties"} onClick={() => setTab("faculties")}>Faculties & Assignments</TabBtn>
          <TabBtn active={tab === "students"} onClick={() => setTab("students")}>All Students</TabBtn>
        </div>

        {tab === "faculties" ? (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            {/* Faculty list */}
            <div className="rounded-2xl bg-card ring-1 ring-border shadow-card p-4">
              <div className="flex gap-2 mb-3">
                <Input placeholder="New faculty name" value={newFaculty} onChange={e => setNewFaculty(e.target.value)} />
                <Button onClick={addFaculty} size="icon" className="shrink-0"><Plus className="h-4 w-4" /></Button>
              </div>
              <ul className="space-y-1.5 max-h-[60vh] overflow-y-auto">
                {faculties.map(f => {
                  const count = assignments.filter(a => a.faculty_id === f.id).length;
                  const active = selectedFaculty === f.id;
                  return (
                    <li key={f.id}>
                      <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-accent/30"}`}>
                        <button onClick={() => setSelectedFaculty(f.id)} className="flex-1 text-left min-w-0">
                          <div className="font-medium truncate">{f.name}</div>
                          <div className={`text-xs ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{count} students</div>
                        </button>
                        <button onClick={() => removeFaculty(f.id)} className={`p-1.5 rounded ${active ? "hover:bg-white/20" : "hover:bg-destructive/10 text-destructive"}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
                {faculties.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No faculties yet</p>}
              </ul>
            </div>

            {/* Assignment panel */}
            <div className="rounded-2xl bg-card ring-1 ring-border shadow-card p-4 sm:p-6">
              {selectedFaculty ? (
                <>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Manage Students</p>
                      <h2 className="font-display text-xl font-bold truncate">{faculties.find(f => f.id === selectedFaculty)?.name}</h2>
                    </div>
                    <span className="text-sm font-semibold rounded-full bg-success/15 text-success px-3 py-1">{assignedIds.size} assigned</span>
                  </div>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 max-h-[55vh] overflow-y-auto pr-1">
                    {filteredStudents.map(s => {
                      const isOn = assignedIds.has(s.id);
                      return (
                        <button key={s.id} onClick={() => toggleAssign(s.id)}
                          className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 ring-1 transition-all ${isOn ? "bg-success/10 ring-success/30" : "ring-border hover:bg-accent/30"}`}>
                          <span className="truncate text-sm font-medium text-left">{s.name}</span>
                          {isOn ? <Check className="h-4 w-4 text-success shrink-0" /> : <Plus className="h-4 w-4 text-muted-foreground shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <Users className="h-10 w-10 mx-auto text-muted-foreground" />
                  <p className="mt-3 text-muted-foreground">Select a faculty to manage their students.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-card ring-1 ring-border shadow-card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
              <div className="flex gap-2">
                <Input placeholder="New student name" value={newStudent} onChange={e => setNewStudent(e.target.value)} />
                <Button onClick={addStudent} className="shrink-0"><Plus className="h-4 w-4 mr-1" /> Add</Button>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStudents.map(s => {
                const inFaculties = assignments.filter(a => a.student_id === s.id).length;
                return (
                  <div key={s.id} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 ring-1 ring-border hover:bg-accent/20">
                    <div className="min-w-0">
                      <div className="font-medium truncate text-sm">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{inFaculties} faculty {inFaculties === 1 ? "assignment" : "assignments"}</div>
                    </div>
                    <button onClick={() => removeStudent(s.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                );
              })}
            </div>
            {filteredStudents.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">No students match your search.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-card p-5 ring-1 ring-border shadow-card flex items-center gap-4">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <div>
        <p className="text-2xl font-bold font-display">{value}</p>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground shadow-soft" : "bg-card ring-1 ring-border hover:bg-accent/30"}`}>{children}</button>
  );
}
