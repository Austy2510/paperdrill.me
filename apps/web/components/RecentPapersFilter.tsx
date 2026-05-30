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
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            What are you <span className="text-gradient">studying</span> today?
          </h1>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto">
            Search over 45,000+ indexed past paper questions from CAIE, Edexcel &amp; IGCSE with AI-powered model answers.
          </p>
        </div>

        <div className="w-full max-w-4xl relative group mt-4">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-foreground/10 rounded-full shadow-2xl shadow-primary/5 focus-within:shadow-primary/20 focus-within:border-primary/30 transition-all duration-300 p-2">
            <div className="pl-6 pr-4">
              <Search className="w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search concepts (e.g. 'enthalpy', 'reflux', 'Newton's Laws')..." 
              className="flex-1 bg-transparent border-none py-4 text-xl font-medium outline-none placeholder:text-muted-foreground/50"
            />
            <button className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-black text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest ml-2">
              Search
            </button>
          </div>
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
          <div className="flex flex-col gap-4">
            {filteredPapers.map((p, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-card border shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary flex flex-col items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-inner border border-foreground/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Yr</span>
                  <span className="font-black text-lg leading-none">{p.year % 100}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-foreground/90 group-hover:text-primary transition-colors">{p.subject} - {p.paper}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{p.board}</span>
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{p.level}</span>
                    {p.session && <span className="px-2 py-0.5 rounded-md bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-wider">{p.session}</span>}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary group-hover:bg-primary/20 transition-colors">
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trending / Insights */}
        <section className="flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> AI Insights
            </h3>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white shadow-2xl shadow-purple-900/20 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 shadow-inner">
                   <Clock className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-2xl font-black mb-3 tracking-tight">Priority Topic</h4>
                <p className="text-sm opacity-90 leading-relaxed mb-8 font-medium">
                  "Organic Chemistry equations appear in 85% of Edexcel Unit 4 papers. Master the mechanisms for reflux!"
                </p>
                <button className="w-full py-3.5 rounded-xl bg-white text-purple-700 font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-[1.02] transition-all uppercase tracking-widest active:scale-95">
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
