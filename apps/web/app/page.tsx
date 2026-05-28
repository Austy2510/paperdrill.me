"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  History, 
  TrendingUp, 
  LayoutGrid, 
  Settings, 
  Bell, 
  ChevronRight,
  BookOpen,
  Zap,
  Clock
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import AITutor from "@/components/AITutor";

const subjects = [
  { name: "Chemistry", count: 1240, color: "bg-blue-500", icon: "🧪" },
  { name: "Physics", count: 980, color: "bg-purple-500", icon: "⚡" },
  { name: "Mathematics", count: 1560, color: "bg-emerald-500", icon: "📐" },
  { name: "Biology", count: 850, color: "bg-rose-500", icon: "🧬" },
];

const recentPapers = [
  { board: "Edexcel", level: "IAL", year: 2023, subject: "Chemistry", session: "Jan", paper: "1C" },
  { board: "CAIE", level: "A Level", year: 2022, subject: "Physics", session: "May/June", paper: "P1" },
  { board: "Edexcel", level: "GCSE", year: 2023, subject: "Maths", session: "June", paper: "H1" },
];

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r bg-muted/20 flex flex-col items-center lg:items-start p-4 lg:p-6 gap-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden lg:block text-gradient">Exam Vault</span>
        </div>

        <nav className="flex-1 w-full flex flex-col gap-2">
          {[
            { icon: LayoutGrid, label: "Overview", active: true },
            { icon: Search, label: "Advanced Search" },
            { icon: History, label: "Saved Questions" },
            { icon: TrendingUp, label: "Syllabus Map" },
            { icon: Clock, label: "Timeline" },
          ].map((item, i) => (
            <button 
              key={i} 
              className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all ${item.active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="font-medium hidden lg:block whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="w-full pt-6 border-t flex flex-col gap-2">
          <button className="flex items-center gap-4 w-full p-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground">
            <Settings className="w-5 h-5 shrink-0" />
            <span className="font-medium hidden lg:block">Settings</span>
          </button>
          <div className="flex items-center gap-4 w-full p-3 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
            <UserButton afterSignOutUrl="/" />
            <div className="hidden lg:block overflow-hidden">
              <p className="text-[11px] font-bold truncate">{user?.fullName || "Loading..."}</p>
              <p className="text-[9px] text-muted-foreground truncate">Student Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gradient-subtle overflow-y-auto">
        {/* Top Header */}
        <header className="p-6 flex items-center justify-between sticky top-0 z-10 glass border-b lg:border-none lg:bg-transparent">
          <div className="relative flex-1 max-w-2xl hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search concepts, question types, or topics..." 
              className="w-full bg-background/50 backdrop-blur border rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2.5 rounded-xl bg-background border shadow-sm hover:bg-muted transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </button>
          </div>
        </header>

        <div className="p-8 flex flex-col gap-12 max-w-7xl mx-auto w-full">
          {/* Hero Search Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 flex flex-col items-center gap-8"
          >
            <div className="flex flex-col gap-3">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                What are you <span className="text-gradient">studying</span> today?
              </h2>
              <p className="text-muted-foreground text-lg font-medium">
                Search over 45,000+ indexed exam questions with AI-powered insights.
              </p>
            </div>

            <div className="w-full max-w-3xl relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search concepts (e.g. 'enthalpy', 'reflux', 'Newton's Laws')..." 
                className="w-full bg-card border-2 border-transparent focus:border-primary/20 rounded-[2rem] py-6 pl-16 pr-8 text-xl font-medium outline-none shadow-xl shadow-primary/5 focus:shadow-primary/10 transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-8 py-3 rounded-[1.5rem] font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                Search
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-2">Filter by Board:</span>
              {["All Boards", "CAIE", "Pearson Edexcel", "AQA", "IB", "Dhaka Board"].map((board) => (
                <button key={board} className={`px-4 py-2 rounded-full transition-all text-xs font-bold border ${board === "All Boards" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary hover:bg-primary/10 hover:text-primary border-transparent hover:border-primary/20"}`}>
                  {board}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-2">Suggestions:</span>
              {["Organic Mechanisms", "Periodic Trends", "Electrolysis", "Kinetics"].map((tag) => (
                <button key={tag} className="px-4 py-2 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary transition-all text-xs font-bold border border-transparent hover:border-primary/20">
                  {tag}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Subjects Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" /> Browse by Subject
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjects.map((s, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative p-6 rounded-3xl bg-card border shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${s.color} opacity-5 blur-3xl -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`} />
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform origin-left">{s.icon}</div>
                  <h4 className="text-xl font-bold mb-1">{s.name}</h4>
                  <p className="text-sm text-muted-foreground font-medium">{s.count} Questions</p>
                  <div className="mt-6 flex items-center text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 tracking-widest uppercase">
                    EXPLORE <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <section className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Recent Papers
                </h3>
                <button className="text-xs font-bold text-primary hover:underline">View All</button>
              </div>
              <div className="flex flex-col gap-3">
                {recentPapers.map((p, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-card border hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-inner">
                      {p.year % 100}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground/90">{p.subject} - {p.paper}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{p.board} • {p.level} • {p.session}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Trending / Insights */}
            <section className="flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-6 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Insights
                </h3>
                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                  <Zap className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                       <Zap className="w-5 h-5" />
                    </div>
                    <h4 className="text-xl font-bold mb-3">Priority Topic</h4>
                    <p className="text-sm opacity-90 leading-relaxed mb-6 font-medium">
                      "Organic Chemistry equations appear in 85% of Edexcel Unit 4 papers. Master the mechanisms for reflux!"
                    </p>
                    <button className="w-full py-3 rounded-xl bg-white text-primary font-bold text-xs shadow-lg hover:bg-white/90 transition-all uppercase tracking-widest">
                      Deep Dive
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <AITutor />
    </div>
  );
}
