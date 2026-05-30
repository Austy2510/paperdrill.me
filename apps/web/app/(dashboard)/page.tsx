import React from "react";
import SubjectGrid from "@/components/SubjectGrid";
import RecentPapersFilter from "@/components/RecentPapersFilter";

import { db, boardsTable, subjectsTable, papersTable } from "@workspace/db";
import { desc } from "drizzle-orm";

// Make the page dynamic so it re-fetches or uses revalidate
export const dynamic = "force-dynamic";

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
