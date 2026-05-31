import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

/**
 * SEO Footer — provides internal linking signals for Google,
 * keyword-rich anchor text, and accessibility compliance.
 */
export default function SEOFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-muted/30 mt-auto pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="gradient-primary w-8 h-8 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-gradient">
                PaperDrill
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Free AI-powered past paper platform for CAIE, Edexcel, and Dhaka
              Board students. Search questions by topic and get instant model
              answers.
            </p>
          </div>

          {/* Past Papers by Board */}
          <nav aria-label="Past papers by exam board">
            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">
              Past Papers by Board
            </h2>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/search?q=CAIE" className="hover:text-primary transition-colors">
                  CAIE Past Papers
                </Link>
              </li>
              <li>
                <Link href="/search?q=Edexcel" className="hover:text-primary transition-colors">
                  Edexcel Past Papers
                </Link>
              </li>
              <li>
                <Link href="/search?q=IGCSE" className="hover:text-primary transition-colors">
                  IGCSE Past Papers
                </Link>
              </li>
              <li>
                <Link href="/search?q=A+Level" className="hover:text-primary transition-colors">
                  A Level Past Papers
                </Link>
              </li>
              <li>
                <Link href="/search?q=O+Level" className="hover:text-primary transition-colors">
                  O Level Past Papers
                </Link>
              </li>
            </ul>
          </nav>

          {/* Past Papers by Subject */}
          <nav aria-label="Past papers by subject">
            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">
              Popular Subjects
            </h2>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/search?q=Chemistry" className="hover:text-primary transition-colors">
                  Chemistry Past Papers
                </Link>
              </li>
              <li>
                <Link href="/search?q=Physics" className="hover:text-primary transition-colors">
                  Physics Past Papers
                </Link>
              </li>
              <li>
                <Link href="/search?q=Mathematics" className="hover:text-primary transition-colors">
                  Mathematics Past Papers
                </Link>
              </li>
              <li>
                <Link href="/search?q=Biology" className="hover:text-primary transition-colors">
                  Biology Past Papers
                </Link>
              </li>
              <li>
                <Link href="/search?q=organic+chemistry" className="hover:text-primary transition-colors">
                  Organic Chemistry Questions
                </Link>
              </li>
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources">
            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">
              Resources
            </h2>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/syllabus" className="hover:text-primary transition-colors">
                  Syllabus Topic Map
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="hover:text-primary transition-colors">
                  Study Timeline &amp; Planner
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Advanced Search
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-primary transition-colors">
                  Saved Questions
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} PaperDrill. All rights reserved.</p>
          <p>
            Free past papers and AI answers for CAIE, Edexcel &amp; IGCSE students worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
