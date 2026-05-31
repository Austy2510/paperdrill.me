import React from "react";
import SubjectGrid from "@/components/SubjectGrid";
import RecentPapersFilter from "@/components/RecentPapersFilter";

import { db, boardsTable, subjectsTable, papersTable } from "@workspace/db";
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
  // Fetch Boards
  const allBoards = await db.select().from(boardsTable).orderBy(boardsTable.sortOrder);
  const boardNames = ["All Boards", ...allBoards.map(b => b.code)];

  // Fetch Subjects (with mock counts since we don't have questions yet)
  const allSubjects = await db.select().from(subjectsTable);
  const subjectsData = allSubjects.map(s => ({
    name: s.name,
    count: Math.floor(Math.random() * 1000) + 500, // Mock count for now
    color: "",
    icon: ""
  }));

  // Fetch Recent Papers
  const allPapers = await db.select().from(papersTable).orderBy(desc(papersTable.createdAt)).limit(10);
  const mappedPapers = allPapers.map(p => ({
    board: p.board,
    level: p.level,
    year: p.year,
    subject: p.subject,
    session: p.paperType || "QP",
    paper: `Paper ${p.paperNumber}`,
  }));
  
  return (
    <div className="p-8 flex flex-col gap-12 max-w-7xl mx-auto w-full">
      <RecentPapersFilter boards={boardNames} papers={mappedPapers}>
        <SubjectGrid subjects={subjectsData} />
      </RecentPapersFilter>
    </div>
  );
}
