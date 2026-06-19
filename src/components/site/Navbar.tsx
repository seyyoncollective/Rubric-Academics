import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";

const nav = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#courses", label: "Courses Offered" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "bg-background/85 backdrop-blur-lg shadow-soft border-b" : "bg-transparent"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img
              src={logoImg}
              alt="Rubric Academics"
              className="h-10 w-auto shrink-0"
            />
            <div className="min-w-0 leading-tight">
              <div className="truncate font-display text-base font-bold">Rubric Academics</div>
              <div className="hidden sm:block text-[11px] text-muted-foreground -mt-0.5">The Pinnacle of Learning</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map(n => (
              <a key={n.href} href={n.href} className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{n.label}</a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link to="/faculty-login"><Button variant="ghost" size="sm">Faculty Login</Button></Link>
            <Link to="/admin-login"><Button size="sm" className="bg-primary hover:bg-primary/90">Admin Login</Button></Link>
          </div>

          <button className="lg:hidden p-2 rounded-md hover:bg-accent/40" onClick={() => setOpen(v => !v)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-1 rounded-xl border bg-card shadow-card p-2">
              {nav.map(n => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-accent/40">{n.label}</a>
              ))}
              <div className="border-t my-1" />
              <Link to="/faculty-login" onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-accent/40">Faculty Login</Link>
              <Link to="/admin-login" onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10">Admin Login</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
