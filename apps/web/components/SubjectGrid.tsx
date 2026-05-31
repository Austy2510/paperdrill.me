"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutGrid, ChevronRight } from "lucide-react";

export interface SubjectData {
  name: string;
  count: number;
  color: string;
  icon: string;
}

export default function SubjectGrid({ subjects }: { subjects: SubjectData[] }) {
  // Add some colors and icons dynamically if they don't exist in DB
  const colorMap: Record<string, string> = {
    Chemistry: "bg-blue-500",
    Physics: "bg-purple-500",
    Mathematics: "bg-emerald-500",
    Biology: "bg-rose-500",
  };

  const iconMap: Record<string, string> = {
    Chemistry: "🧪",
    Physics: "⚡",
    Mathematics: "📐",
    Biology: "🧬",
  };

  const enrichedSubjects = subjects.map((s) => ({
    ...s,
    color: s.color || colorMap[s.name] || "bg-gray-500",
    icon: s.icon || iconMap[s.name] || "📚",
  }));

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" /> Browse by Subject
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {enrichedSubjects.map((s, i) => (
          <a href={`/search?subject=${encodeURIComponent(s.name)}`} key={i} className="block">
            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className={`group relative p-6 rounded-[2rem] bg-card border border-foreground/5 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer overflow-hidden flex flex-col justify-between h-48`}
            >
              <div className={`absolute top-0 right-0 w-48 h-48 ${s.color} opacity-0 blur-[50px] -mr-20 -mt-20 group-hover:opacity-15 transition-opacity duration-500`} />
              
              <div className="flex justify-between items-start z-10">
                <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center text-3xl transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 shadow-inner border border-white/10 backdrop-blur-sm">
                  {s.icon}
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                  <ChevronRight className="w-4 h-4 text-primary" />
                </div>
              </div>

              <div className="z-10 mt-auto">
                <h4 className="text-2xl font-black tracking-tight mb-1">{s.name}</h4>
                <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase">{s.count.toLocaleString()} Questions</p>
              </div>
            </motion.div>
          </a>
        ))}
      </div>
    </section>
  );
}
