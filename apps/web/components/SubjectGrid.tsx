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
  );
}
