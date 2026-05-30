"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronRight, Clock, TrendingUp } from "lucide-react";

export interface PaperData {
  board: string;
  level: string;
  year: number;
  subject: string;
  session: string | null;
  paper: string;
}

interface RecentPapersFilterProps {
  boards: string[];
  papers: PaperData[];
  children?: React.ReactNode;
}

export default function RecentPapersFilter({ boards, papers, children }: RecentPapersFilterProps) {
  const [selectedBoard, setSelectedBoard] = useState("All Boards");

  const filteredPapers = selectedBoard === "All Boards" 
    ? papers 
    : papers.filter(p => p.board === selectedBoard);

  return (
    <>
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
          {boards.map((board) => (
            <button 
              key={board} 
              onClick={() => setSelectedBoard(board)}
              className={`px-4 py-2 rounded-full transition-all text-xs font-bold border ${board === selectedBoard ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary border-transparent hover:border-primary/20"}`}
            >
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

      {children}

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
            {filteredPapers.map((p, i) => (
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
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{p.board} • {p.level} • {p.session || ""}</p>
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
              <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform bg-white rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                   <Clock className="w-5 h-5" />
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
    </>
  );
}
