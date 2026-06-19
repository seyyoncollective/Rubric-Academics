import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import {
  Users, GraduationCap, ClipboardCheck, MessagesSquare, Trophy, UserCog,
  Phone, MapPin, Clock, MessageCircle, Sparkles, BookOpen, FlaskConical,
  Calculator, Languages, Mic, Brush, ArrowRight, CheckCircle2,
} from "lucide-react";
import heroImg from "@/assets/hero-education.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rubric Academics — Tuition Centre in Chennai | KG to 12th Coaching" },
      { name: "description", content: "Rubric Academics offers personalized CBSE & TNSB coaching from KG–12th, science & commerce streams, plus language academies in Chennai. Admissions open." },
      { property: "og:title", content: "Rubric Academics — The Pinnacle of Learning" },
      { property: "og:description", content: "Personalized coaching for KG–12th in Chennai. Admissions open." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const WHATSAPP = "https://wa.me/918148070336";
const MAPS = "https://maps.app.goo.gl/GH8BWWDYJ5rtAqgE8";

const features = [
  { icon: Users, title: "Experienced Faculty", text: "Subject specialists with years of classroom expertise." },
  { icon: GraduationCap, title: "Small Batch Sizes", text: "Personalized attention so no learner is left behind." },
  { icon: ClipboardCheck, title: "Regular Assessments", text: "Structured tests to track and reinforce progress." },
  { icon: MessagesSquare, title: "Parent Updates", text: "Transparent feedback on each student's growth." },
  { icon: Trophy, title: "Exam Preparation", text: "Focused strategies for board & competitive exams." },
  { icon: UserCog, title: "Personalised Mentorship", text: "1-on-1 guidance tailored to every student's needs." },
];

const courses = [
  { icon: BookOpen, title: "Academic Foundation Programme", grade: "KG – Grade 8",
    badge: "All Subjects", text: "Strong conceptual foundation across all subjects with personalized guidance." },
  { icon: GraduationCap, title: "Secondary & Senior Secondary Programme", grade: "Grade 9 – Grade 12",
    badge: "All Subjects", extra: "Single Subject Coaching Available",
    text: "Focused academic support and examination preparation for secondary and higher secondary students." },
  { icon: FlaskConical, title: "Science Stream Excellence", grade: "Grade 11 & 12",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    text: "Intensive coaching for board examinations and competitive readiness." },
  { icon: Calculator, title: "Commerce Excellence", grade: "Grade 11 & 12",
    subjects: ["Accountancy"], text: "Specialized coaching for commerce stream students." },
  { icon: Languages, title: "Special Language Coaching", grade: "Written Language Coaching",
    subjects: ["Hindi", "Tamil"], text: "Build reading, writing, and language proficiency skills." },
  { icon: Mic, title: "Co-Curricular Development", grade: "Junior & Senior Levels",
    subjects: ["Phonetic Classes", "Grammar Classes"],
    text: "Enhancing communication, pronunciation, and language development." },
  { icon: Brush, title: "Creative & Skill Development", grade: "All Ages",
    subjects: ["Vedic Maths", "Abacus", "Drawing", "Painting"],
    text: "Develop analytical thinking, creativity, and cognitive skills." },
];

function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 bg-gradient-soft">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-blob" aria-hidden />
        <div className="absolute top-40 -right-10 h-80 w-80 rounded-full bg-accent/25 blur-3xl animate-blob" style={{ animationDelay: "3s" }} aria-hidden />
        <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-primary-glow/20 blur-3xl animate-blob" style={{ animationDelay: "6s" }} aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 text-success px-3 py-1.5 text-xs font-semibold ring-1 ring-success/20">
              <Sparkles className="h-3.5 w-3.5" /> Admissions Open · KG–12th
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
              Rubric <span className="bg-gradient-hero bg-clip-text text-transparent">Academics</span>
            </h1>
            <p className="mt-3 text-lg sm:text-xl font-display font-semibold text-primary">The Pinnacle of Learning</p>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl">
              Personalized coaching, experienced teachers, and a supportive learning environment for students from Grade KG to Grade 12.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href={WHATSAPP} target="_blank" rel="noreferrer">
                <Button size="lg" className="bg-success hover:bg-success/90 text-success-foreground shadow-elegant">
                  Enroll Now <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </a>
              <a href={MAPS} target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <MapPin className="mr-1 h-4 w-4" /> Visit Us
                </Button>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["CBSE & TNSB", "Experienced Faculty", "Small Batches", "Trusted by Parents"].map(t => (
                <span key={t} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" />{t}</span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-hero opacity-20 blur-2xl" aria-hidden />
            <div className="relative rounded-[2rem] overflow-hidden bg-card shadow-elegant ring-1 ring-border animate-float">
              <img src={heroImg} alt="Students learning together at Rubric Academics" width={1280} height={1024} className="w-full h-auto" />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-elegant ring-1 ring-border">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-success/15 text-success"><Trophy className="h-5 w-5" /></div>
              <div className="text-xs">
                <div className="font-semibold">Results that matter</div>
                <div className="text-muted-foreground">Board & competitive ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary">Why Choose Us</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Why Choose Rubric Academics</h2>
            <p className="mt-3 text-muted-foreground">Everything a student needs to thrive, under one roof.</p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="group rounded-2xl bg-gradient-card p-6 ring-1 ring-border shadow-card hover:shadow-elegant transition-all hover:-translate-y-1">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-gradient-hero group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="py-20 sm:py-28 bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold shadow-soft">
              CBSE & TNSB Curriculum Coaching
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold">Courses Offered</h2>
            <p className="mt-3 text-muted-foreground">Carefully structured programmes for every stage of a student's journey.</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(({ icon: Icon, title, grade, badge, subjects, text, extra }) => (
              <article key={title} className="rounded-2xl bg-card p-6 ring-1 ring-border shadow-card hover:shadow-elegant transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent"><Icon className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold leading-tight">{title}</h3>
                    <p className="text-xs text-muted-foreground">{grade}</p>
                  </div>
                </div>
                {badge && <span className="inline-block mt-3 text-[11px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">{badge}</span>}
                {subjects && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {subjects.map(s => <li key={s} className="text-xs rounded-full bg-secondary px-2.5 py-1">{s}</li>)}
                  </ul>
                )}
                {extra && <p className="mt-3 text-xs font-medium text-success">✓ {extra}</p>}
                <p className="mt-3 text-sm text-muted-foreground">{text}</p>
              </article>
            ))}

            {/* Premium Spoken Language Academy card */}
            <article className="md:col-span-2 lg:col-span-3 rounded-2xl p-[1.5px] bg-gradient-hero shadow-elegant">
              <div className="rounded-[calc(theme(borderRadius.2xl)-1.5px)] bg-card p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      <Sparkles className="h-3.5 w-3.5" /> Premium Programme
                    </div>
                    <h3 className="mt-1 font-display text-2xl font-bold">Spoken Language Academy</h3>
                    <p className="text-sm text-muted-foreground">Master your communication skills.</p>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-success/15 text-success px-3 py-1 rounded-full">Online & Offline</span>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="rounded-xl bg-gradient-soft p-5 ring-1 ring-border">
                    <h4 className="font-semibold">National Languages</h4>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {["Hindi", "English"].map(l => <li key={l} className="text-sm rounded-full bg-card ring-1 ring-border px-3 py-1">{l}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-gradient-soft p-5 ring-1 ring-border">
                    <h4 className="font-semibold">International Languages</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Upskill for global opportunities</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {["German", "French", "Japanese"].map(l => <li key={l} className="text-sm rounded-full bg-card ring-1 ring-border px-3 py-1">{l}</li>)}
                    </ul>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">Mainly for adults and working professionals.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary">Get in touch</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Contact Us</h2>
            <p className="mt-3 text-muted-foreground">We'd love to hear from you. Reach us through any of these channels.</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <a href="tel:+918148070336" className="group rounded-2xl bg-gradient-card p-6 ring-1 ring-border shadow-card hover:shadow-elegant transition-all hover:-translate-y-1">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><Phone className="h-6 w-6" /></div>
              <h3 className="mt-4 font-display font-bold">Primary Phone</h3>
              <p className="text-sm text-muted-foreground">Tap to call</p>
              <p className="mt-2 font-semibold text-primary">+91 81480 70336</p>
            </a>
            <a href="tel:+919566070336" className="group rounded-2xl bg-gradient-card p-6 ring-1 ring-border shadow-card hover:shadow-elegant transition-all hover:-translate-y-1">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><Phone className="h-6 w-6" /></div>
              <h3 className="mt-4 font-display font-bold">Secondary Phone</h3>
              <p className="text-sm text-muted-foreground">Tap to call</p>
              <p className="mt-2 font-semibold text-primary">+91 95660 70336</p>
            </a>
            <a href={MAPS} target="_blank" rel="noreferrer" className="group rounded-2xl bg-gradient-card p-6 ring-1 ring-border shadow-card hover:shadow-elegant transition-all hover:-translate-y-1">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors"><MapPin className="h-6 w-6" /></div>
              <h3 className="mt-4 font-display font-bold">Visit Our Campus</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                No. 23, Thiruvalluvar Salai,<br />Thiru Nagar, Alwarthirunagar,<br />Chennai - 600087
              </p>
            </a>
            <div className="rounded-2xl bg-gradient-card p-6 ring-1 ring-border shadow-card">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><Clock className="h-6 w-6" /></div>
              <h3 className="mt-4 font-display font-bold">Working Hours</h3>
              <ul className="mt-2 text-sm space-y-1">
                <li className="flex justify-between"><span className="text-muted-foreground">Mon – Sat</span><span className="font-medium">10:00 AM – 9:00 PM</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Sunday</span><span className="font-medium">Enquiry only</span></li>
              </ul>
            </div>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="md:col-span-2 group rounded-2xl bg-gradient-to-br from-success to-success/80 text-success-foreground p-6 shadow-elegant flex items-center justify-between gap-4 hover:scale-[1.01] transition-transform">
              <div className="flex items-center gap-4 min-w-0">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/20"><MessageCircle className="h-6 w-6" /></div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-lg">Chat on WhatsApp</h3>
                  <p className="text-sm opacity-90">Quick replies during working hours</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
