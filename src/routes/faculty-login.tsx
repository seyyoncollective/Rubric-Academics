import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Lock, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FACULTY_PASSWORD, isFacultyAuthed, setFacultyAuthed } from "@/lib/portal-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/faculty-login")({
  head: () => ({ meta: [{ title: "Faculty Login — Rubric Academics" }, { name: "robots", content: "noindex" }] }),
  component: FacultyLogin,
});

function FacultyLogin() {
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  useEffect(() => { if (isFacultyAuthed()) navigate({ to: "/faculty" }); }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === FACULTY_PASSWORD) {
      setFacultyAuthed(true);
      toast.success("Welcome");
      navigate({ to: "/faculty" });
    } else {
      toast.error("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-soft p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"><ArrowLeft className="h-4 w-4" /> Back to site</Link>
        <div className="rounded-2xl bg-card p-8 ring-1 ring-border shadow-elegant">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent/70 text-white shadow-soft mx-auto">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-center font-display">Faculty Portal</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">Enter the faculty password to record attendance.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} className="pl-9 h-11" autoFocus />
            </div>
            <Button type="submit" className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground">Login</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
