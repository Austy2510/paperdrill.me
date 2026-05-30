"use client";

import React from "react";
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ChevronRight,
  BookmarkCheck,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

const STUDY_PHASES = [
  {
    phase: "Phase 1",
    title: "Foundation & Syllabus Mapping",
    duration: "June - September",
    description: "Map core topics to textbooks and isolate weak key points. Build foundational structural knowledge in Chemistry, Physics, Biology, and Mathematics.",
    status: "completed",
    tasks: ["Review syllabus specifications", "Complete primary topic mapping", "Identify core mathematical models"]
  },
  {
    phase: "Phase 2",
    title: "Topical Past Paper Drills",
    duration: "October - December",
    description: "Deep dive into past paper question banks segmented by specific topics. Drill with active recall and step-by-step model answers.",
    status: "active",
    tasks: ["Solve 50+ topical past paper questions", "Resolve complex calculations with AI Tutor", "Tag difficult concepts for review"]
  },
  {
    phase: "Phase 3",
    title: "Yearly Mock Simulations",
    duration: "January - March",
    description: "Simulate full yearly past papers under real, timed exam conditions. Improve speed, pacing, and precision under stress.",
    status: "upcoming",
    tasks: ["Complete 10 full length practice exams", "Identify speed/pacing bottlenecks", "Map progress metrics to target grades"]
  },
  {
    phase: "Phase 4",
    title: "Intensive Revision & Live Boards",
    duration: "April - June",
    description: "Perform final hyper-focused revisions on bookmarked questions. Review with AI Tutor and sit for actual board exam series.",
    status: "upcoming",
    tasks: ["Review all saved/bookmarked questions", "Conduct quick-fire formula drills", "Sit for live CAIE & Edexcel papers"]
  }
];

const BOARD_SERIES = [
  {
    board: "CAIE A Level",
    series: "Oct/Nov Series",
    status: "Registration Open",
    date: "Starts Oct 2026",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-500"
  },
  {
    board: "Edexcel IAL",
    series: "January Series",
    status: "Preparation",
    date: "Starts Jan 2027",
    color: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-500"
  },
  {
    board: "CAIE & Edexcel",
    series: "May/June Series",
    status: "Main Series",
    date: "Starts May 2027",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-500"
  }
];

export default function TimelinePage() {
  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-semibold tracking-wider uppercase text-primary">Your Journey</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
          Study Timeline & Milestones
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base max-w-2xl leading-relaxed">
          Pace your preparation through our proven four-phase Past-Paper Drill methodology. Track major exam series and structure your journey to achieve top grades.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Timeline Path (Col-Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 px-1">
            <Award className="w-5 h-5 text-primary" />
            Preparation Roadmap
          </h2>
          
          <div className="relative border-l pl-6 ml-4 space-y-10 py-2">
            {STUDY_PHASES.map((p, idx) => {
              const isActive = p.status === "active";
              const isCompleted = p.status === "completed";
              
              return (
                <div key={idx} className="relative group">
                  {/* Icon Indicator on Timeline border */}
                  <div className="absolute -left-[35px] top-1 flex items-center justify-center">
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center ring-4 ring-background shadow-md">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    ) : isActive ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center ring-4 ring-background shadow-md animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-muted border-2 border-muted-foreground/30 flex items-center justify-center ring-4 ring-background">
                        <Circle className="w-3 h-3 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  {/* Phase Details Card */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    isActive 
                      ? "bg-card shadow-xl border-primary/30 ring-1 ring-primary/10" 
                      : "bg-muted/10 hover:bg-muted/30 border-transparent"
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isCompleted 
                          ? "bg-emerald-500/10 text-emerald-500" 
                          : isActive 
                            ? "bg-primary/10 text-primary" 
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {p.phase} · {p.status}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {p.duration}
                      </span>
                    </div>

                    <h3 className="font-bold text-base group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{p.description}</p>

                    {/* Task checklist within phase */}
                    <div className="mt-4 pt-4 border-t border-muted/40 space-y-2">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">Target Checklist</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        {p.tasks.map((t, tIdx) => (
                          <div key={tIdx} className="flex items-center gap-2 text-xs text-foreground/80">
                            <ChevronRight className="w-3 h-3 text-primary/60 shrink-0" />
                            <span className="truncate">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Cards (Col-Span 1) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 px-1">
            <Calendar className="w-5 h-5 text-primary" />
            Exam Series Countdown
          </h2>

          <div className="space-y-4">
            {BOARD_SERIES.map((s, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border bg-gradient-to-br ${s.color} flex flex-col gap-3 hover:scale-[1.02] transition-transform`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider">{s.board}</span>
                  <span className="text-[10px] bg-background/50 border border-current/20 px-2 py-0.5 rounded-full font-medium">{s.status}</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-foreground">{s.series}</h4>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {s.date}
                  </p>
                </div>
                <div className="pt-2 border-t border-current/10 flex items-center justify-between text-xs font-semibold group cursor-pointer">
                  <span>Explore past papers</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Productivity Tip */}
          <div className="p-6 rounded-3xl border bg-gradient-to-br from-primary/10 via-transparent to-transparent space-y-3 relative overflow-hidden">
            <div className="absolute right-3 top-3 opacity-10">
              <Sparkles className="w-16 h-16 text-primary" />
            </div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Drilling Tip
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Drill past papers **topically** first! Do not jump into yearly mocks immediately. Isolating topic blocks in Chemistry, Physics, and Maths allows your brain to classify concepts and recognize standard CAIE & Edexcel question formulations.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
