import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ADMIN_PASSWORD, isAdminAuthed, setAdminAuthed } from "@/lib/portal-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Admin Login — Rubric Academics" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  useEffect(() => { if (isAdminAuthed()) navigate({ to: "/admin" }); }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAdminAuthed(true);
      toast.success("Welcome, Admin");
      navigate({ to: "/admin" });
    } else {
      toast.error("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-soft p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"><ArrowLeft className="h-4 w-4" /> Back to site</Link>
        <div className="rounded-2xl bg-card p-8 ring-1 ring-border shadow-elegant">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-hero text-white shadow-soft mx-auto">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-center font-display">Admin Portal</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">Enter the admin password to continue.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} className="pl-9 h-11" autoFocus />
            </div>
            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90">Login</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
