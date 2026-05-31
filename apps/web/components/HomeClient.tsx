"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ChevronRight, Search as SearchIcon, Bookmark, MessageSquare, Clock } from "lucide-react";
import { QuestionCard } from "@/components/QuestionCard";
import GoogleAd from "@/components/GoogleAd";

const BOARDS = ["All Boards", "CAIE", "Edexcel", "IB", "Dhaka"];
const TOPICS = [
  "Organic Mechanisms", "Periodic Trends", "Differentiation",
  "Genetic Inheritance", "Electrolysis", "Newton's Laws",
  "Stoichiometry", "Redox Reactions",
];

interface HomeClientProps {
  recentQuestions: any[];
}

export default function HomeClient({ recentQuestions }: HomeClientProps) {
  const [activeBoard, setActiveBoard] = useState("All Boards");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleTopicClick = (topic: string) => {
    router.push(`/search?q=${encodeURIComponent(topic)}`);
  };

  const filteredQuestions = recentQuestions
    .filter((q) => activeBoard === "All Boards" || q.board === activeBoard)
    .slice(0, 3); // Just show a few on home page

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 pt-16 pb-24">
      {/* Hero */}
      <div className="mb-12 text-center md:text-left flex flex-col items-center md:items-start">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium text-amber-500 tracking-wider uppercase">AI-Powered · Free Forever</span>
        </div>
        <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/80 to-muted-foreground">
          Find past papers.<br />
          <span className="italic font-medium text-foreground">Ace your exams.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl font-inter leading-relaxed mb-10">
          Search thousands of CAIE, Edexcel & Dhaka Board past papers. Get AI model answers — free, no account needed.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-3xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-500" />
          <div className="relative flex items-center bg-card border border-amber-500/30 rounded-2xl p-2 shadow-[0_0_30px_rgba(245,158,11,0.1)] focus-within:border-amber-500 transition-all">
            <div className="pl-4 pr-3"><SearchIcon className="w-6 h-6 text-amber-500" /></div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, concepts, or question types (e.g. 'enthalpy changes')" 
              className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground py-4 focus:outline-none text-lg font-inter" 
              data-testid="input-home-search"
            />
            <button type="submit" className="bg-amber-500 text-black px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-amber-600 transition-colors ml-2 cursor-pointer" data-testid="button-home-search">
              Search <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Board Filters */}
      <div className="mb-8">
        <div className="flex border-b border-border overflow-x-auto no-scrollbar">
          {BOARDS.map((board) => (
            <button key={board} onClick={() => setActiveBoard(board)}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-all border-b-2 rounded-t-lg cursor-pointer ${activeBoard === board ? "border-amber-500 text-amber-600 dark:text-amber-500 bg-amber-500/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              data-testid={`tab-board-${board}`}>
              {board}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Chips */}
      <div className="mb-6">
        <h3 className="font-playfair text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-muted-foreground" /> Frequently Searched
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {TOPICS.map((topic) => (
            <button 
              key={topic} 
              onClick={() => handleTopicClick(topic)}
              className="px-4 py-2 rounded-full bg-card border border-border text-foreground/80 text-sm hover:bg-muted/50 hover:border-amber-500/30 hover:text-foreground transition-all font-inter cursor-pointer"
              data-testid={`chip-topic-${topic}`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <GoogleAd slot="home-top-ad" className="w-full min-h-[100px] my-10 border-dashed border-2" />

      {/* Question Cards (Recent Extracts) */}
      <div>
        <h2 className="font-playfair text-3xl font-semibold mb-6 text-foreground flex items-center gap-2">
          <Clock className="w-6 h-6 text-muted-foreground" />
          Recent Extracts
        </h2>
        {filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground font-inter py-8">No recent extracts found for {activeBoard}. Try searching or selecting another board.</p>
        )}
      </div>

      <GoogleAd slot="home-bottom-ad" className="w-full min-h-[100px] my-10 border-dashed border-2" />

      {/* Floating AI Button */}
      <button className="fixed bottom-24 md:bottom-8 right-8 z-50 bg-amber-500 text-black p-4 rounded-full shadow-[0_10px_40px_rgba(245,158,11,0.3)] hover:scale-105 hover:bg-amber-600 transition-all flex items-center gap-3 group cursor-pointer">
        <MessageSquare className="w-6 h-6" />
        <span className="font-medium font-inter pr-2 max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          Ask Study Assistant
        </span>
      </button>
    </div>
  );
}
