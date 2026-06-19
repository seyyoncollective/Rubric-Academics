import { Phone, Mail, GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gradient-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero shadow-soft">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-display font-bold">Rubric Academics</div>
                <div className="text-xs text-muted-foreground">The Pinnacle of Learning</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Personalized coaching for KG to Grade 12 with experienced faculty and a supportive learning environment.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="text-muted-foreground hover:text-primary">Home</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-primary">About</a></li>
              <li><a href="#courses" className="text-muted-foreground hover:text-primary">Courses Offered</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-primary">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Get in Touch</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="tel:+918148070336" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Phone className="h-4 w-4" />+91 81480 70336</a></li>
              <li><a href="mailto:anjumdumi@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Mail className="h-4 w-4" />anjumdumi@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Rubric Academics. All rights reserved. · Developed by <span className="font-medium text-foreground">Seyyon Collective</span>
        </div>
      </div>
    </footer>
  );
}
