import React from "react";
import { Search, BookOpen, Zap, Filter } from "lucide-react";
import { db, questionsTable } from "@workspace/db";
import { ilike, or, and, desc, eq } from "drizzle-orm";
import SaveBookmarkButton from "@/components/SaveBookmarkButton";
import { QuestionCard } from "@/components/QuestionCard";
import SearchClient from "@/components/SearchClient";
import { logTelemetry } from "@/app/actions";
import type { Metadata } from "next";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const subject = typeof params.subject === 'string' ? params.subject : '';
  
  let title = "Search Past Paper Questions — CAIE, Edexcel, IGCSE Topics";
  if (q) {
    title = `Search results for "${q}" | PaperDrill`;
  } else if (subject) {
    title = `${subject} Past Paper Questions | PaperDrill`;
  }

  return {
    title,
    description: "Search thousands of CAIE, Edexcel and IGCSE past paper questions by topic. Find Chemistry, Physics, Mathematics and Biology questions with instant model answers.",
    alternates: { canonical: "https://www.paperdrill.me/search" },
    openGraph: {
      title,
      description: "Search thousands of past paper questions across Chemistry, Physics, Mathematics and Biology. Filter by board, level and topic.",
      url: "https://www.paperdrill.me/search",
    },
  };
}

const SUBJECT_COLORS: Record<string, string> = {
  Chemistry: "bg-emerald-500/10 text-emerald-600",
  Mathematics: "bg-blue-500/10 text-blue-600",
  Physics: "bg-purple-500/10 text-purple-600",
  Biology: "bg-rose-500/10 text-rose-600",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-600",
  Medium: "bg-amber-500/10 text-amber-600",
  Hard: "bg-red-500/10 text-red-600",
};

export default async function AdvancedSearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const subject = typeof params.subject === 'string' ? params.subject : '';
  const board = typeof params.board === 'string' ? params.board : '';

  let results: typeof questionsTable.$inferSelect[] = [];

  const conditions = [];
  
  if (q && q.trim() !== "") {
    const searchTerm = `%${q}%`;
    conditions.push(
      or(
        ilike(questionsTable.questionText, searchTerm),
        ilike(questionsTable.topic, searchTerm),
        ilike(questionsTable.subject, searchTerm),
        ilike(questionsTable.answerText, searchTerm),
      )
    );
  }
  
  if (subject) {
    conditions.push(eq(questionsTable.subject, subject));
  }
  
  if (board && board !== "All Boards") {
    conditions.push(eq(questionsTable.board, board));
  }

  try {
    let query = db
      .select()
      .from(questionsTable)
      .$dynamic();
      
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    results = await query
      .orderBy(desc(questionsTable.year))
      .limit(50);
  } catch (e) {
    console.error("Search query failed:", e);
    throw new Error("Failed to search the database. Please try again.");
  }

  if (q && q.trim() !== "") {
    logTelemetry("search", q as string);
  }

  return (
    <div className="w-full">
      <SearchClient initialQuery={q} initialBoard={board || "All Boards"} results={results} />
    </div>
  );
}
