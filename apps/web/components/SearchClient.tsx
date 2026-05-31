"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { QuestionCard } from "@/components/QuestionCard";
import GoogleAd from "@/components/GoogleAd";

const BOARDS = ["All Boards", "CAIE", "Edexcel", "IB", "Dhaka"];

interface SearchClientProps {
  initialQuery: string;
  initialBoard: string;
  results: any[];
}

export default function SearchClient({ initialQuery, initialBoard, results }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeBoard, setActiveBoard] = useState(initialBoard);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Sync with URL parameters if they change
  useEffect(() => {
    setSearchQuery(searchParams?.get("q") || "");
    setActiveBoard(searchParams?.get("board") || "All Boards");
  }, [searchParams]);

  // Handle board changes by updating the URL
  const handleBoardClick = (board: string) => {
    setActiveBoard(board);
    updateSearchParams(searchQuery, board);
  };

  // Handle search by updating URL (we don't debounce here, wait for enter/submit)
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSearchParams(searchQuery, activeBoard);
  };

  const updateSearchParams = (q: string, board: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (board && board !== "All Boards") params.set("board", board);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 pt-12 pb-24">
      <h1 className="font-playfair text-4xl font-bold mb-8 text-foreground">Search Past Papers</h1>

      <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-card border border-border rounded-2xl p-2 mb-8 focus-within:border-amber-500 transition-all">
        <div className="pl-4 pr-3"><SearchIcon className="w-5 h-5 text-muted-foreground" /></div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions, topics..." 
          className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground py-3 focus:outline-none text-base font-inter" 
          data-testid="input-search-page"
        />
        <button type="submit" className="hidden">Submit</button>
      </form>

      <div className="mb-8">
        <div className="flex border-b border-border overflow-x-auto no-scrollbar">
          {BOARDS.map((board) => (
            <button key={board} onClick={() => handleBoardClick(board)}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-all border-b-2 rounded-t-lg cursor-pointer ${activeBoard === board ? "border-amber-500 text-amber-600 dark:text-amber-500 bg-amber-500/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              data-testid={`search-tab-board-${board}`}>
              {board}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center text-sm font-inter text-muted-foreground">
        <span>Found {results.length} result{results.length !== 1 ? 's' : ''}</span>
      </div>

      <GoogleAd slot="search-top-ad" className="w-full my-6" />

      {results.length > 0 ? (
        <div className="flex flex-col gap-6">
          {results.map((q, index) => (
            <React.Fragment key={q.id}>
              <QuestionCard question={q} />
              {index === 2 && (
                <GoogleAd slot="search-inline-ad" className="w-full my-6" />
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-border rounded-2xl bg-card mt-8">
          <p className="text-muted-foreground font-inter mb-4">No questions found matching your criteria.</p>
          <button 
            onClick={() => {
              setSearchQuery("");
              setActiveBoard("All Boards");
              updateSearchParams("", "All Boards");
            }}
            className="text-amber-500 hover:underline text-sm font-medium cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
