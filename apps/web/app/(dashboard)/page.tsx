import React from "react";
import HomeClient from "@/components/HomeClient";
import { db, questionsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Past Papers & AI Answers — CAIE, Edexcel, IGCSE | PaperDrill",
  description:
    "Browse thousands of free CAIE, Edexcel & Dhaka Board past papers. Search A Level, O Level and IGCSE questions by topic, get instant AI model answers, and boost your exam grades.",
  alternates: { canonical: "https://www.paperdrill.me/" },
  openGraph: {
    title: "Free Past Papers & AI Answers — CAIE, Edexcel, IGCSE",
    description:
      "Browse thousands of free CAIE, Edexcel & Dhaka Board past papers with instant AI answers.",
    url: "https://www.paperdrill.me/",
  },
};

// Make the page dynamic so it re-fetches or uses revalidate
export const revalidate = 60;

export default async function Dashboard() {
  // Fetch Recent Extracts (Questions)
  const recentQuestions = await db
    .select({
      id: questionsTable.id,
      subject: questionsTable.subject,
      board: questionsTable.board,
      year: questionsTable.year,
      questionText: questionsTable.questionText,
      answerText: questionsTable.answerText,
      marks: questionsTable.marks,
      topic: questionsTable.topic,
      questionNumber: questionsTable.questionNumber,
    })
    .from(questionsTable)
    .orderBy(desc(questionsTable.createdAt))
    .limit(10);
  
  return (
    <div className="flex flex-col w-full">
      <HomeClient recentQuestions={recentQuestions} />
    </div>
  );
}
