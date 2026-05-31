"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1 max-w-2xl mr-4 md:mr-0">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search concepts, question types, or topics..." 
        className="w-full bg-background/50 backdrop-blur border rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
      />
    </form>
  );
}
