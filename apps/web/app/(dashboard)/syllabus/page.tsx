import React from "react";
import { db, questionsTable } from "@workspace/db";
import { count, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { TrendingUp, BookOpen, Layers, Target } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syllabus Map — Topic Coverage for CAIE, Edexcel & IGCSE",
  description:
    "Explore complete syllabus topic maps for CAIE, Edexcel and IGCSE. See question coverage by subject, board and topic area. Plan your revision with data-driven insights.",
  alternates: { canonical: "https://www.paperdrill.me/syllabus" },
  openGraph: {
    title: "Syllabus Topic Map & Question Coverage | PaperDrill",
    description:
      "View topic-by-topic syllabus breakdowns for Chemistry, Physics, Mathematics and Biology across all major exam boards.",
    url: "https://www.paperdrill.me/syllabus",
  },
};

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Chemistry:   { bg: "bg-emerald-500/10", text: "text-emerald-700", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  Mathematics: { bg: "bg-blue-500/10",    text: "text-blue-700",    border: "border-blue-500/20",    dot: "bg-blue-500"   },
  Physics:     { bg: "bg-purple-500/10",  text: "text-purple-700",  border: "border-purple-500/20",  dot: "bg-purple-500" },
  Biology:     { bg: "bg-rose-500/10",    text: "text-rose-700",    border: "border-rose-500/20",    dot: "bg-rose-500"   },
};

const BOARD_COLORS: Record<string, string> = {
  CAIE:    "bg-sky-500/10 text-sky-700",
  Edexcel: "bg-orange-500/10 text-orange-700",
  AQA:     "bg-violet-500/10 text-violet-700",
  IB:      "bg-teal-500/10 text-teal-700",
  Dhaka:   "bg-lime-500/10 text-lime-700",
};

export default async function SyllabusMapPage() {
  // Aggregate: topics per subject with question counts
  const topicData = await db
    .select({
      subject: questionsTable.subject,
      board: questionsTable.board,
      topic: questionsTable.topic,
      count: count(),
    })
    .from(questionsTable)
    .groupBy(questionsTable.subject, questionsTable.board, questionsTable.topic)
    .orderBy(questionsTable.subject, desc(count()));

  // Aggregate: total per subject
  const subjectTotals = await db
    .select({
      subject: questionsTable.subject,
      total: count(),
    })
    .from(questionsTable)
    .groupBy(questionsTable.subject)
    .orderBy(desc(count()));

  // Aggregate: board breakdown
  const boardTotals = await db
    .select({
      board: questionsTable.board,
      subject: questionsTable.subject,
      total: count(),
    })
    .from(questionsTable)
    .groupBy(questionsTable.board, questionsTable.subject)
    .orderBy(questionsTable.board, questionsTable.subject);

  // Group topics by subject
  const bySubject: Record<string, { board: string; topic: string | null; count: number }[]> = {};
  for (const row of topicData) {
    if (!bySubject[row.subject]) bySubject[row.subject] = [];
    bySubject[row.subject].push({ board: row.board, topic: row.topic, count: row.count });
  }

  // Group board breakdown by subject
  const boardBySubject: Record<string, { board: string; total: number }[]> = {};
  for (const row of boardTotals) {
    if (!boardBySubject[row.subject]) boardBySubject[row.subject] = [];
    boardBySubject[row.subject].push({ board: row.board, total: row.total });
  }

  const totalQuestions = subjectTotals.reduce((acc, s) => acc + s.total, 0);
  const uniqueBoards = [...new Set(topicData.map((r) => r.board))];
  const uniqueTopics = topicData.filter((r) => r.topic).length;

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Syllabus Map</h1>
          <p className="text-sm text-muted-foreground">
            Explore topics and question coverage across all boards and subjects
          </p>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-5 flex flex-col gap-1">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{totalQuestions}</p>
          <p className="text-xs text-muted-foreground font-medium">Total Questions</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 flex flex-col gap-1">
          <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-2">
            <Layers className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold">{subjectTotals.length}</p>
          <p className="text-xs text-muted-foreground font-medium">Subjects</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 flex flex-col gap-1">
          <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{uniqueTopics}</p>
          <p className="text-xs text-muted-foreground font-medium">Topic Areas</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 flex flex-col gap-1">
          <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold">{uniqueBoards.length}</p>
          <p className="text-xs text-muted-foreground font-medium">Exam Boards</p>
        </div>
      </div>

      {/* Subject breakdown - visual bars */}
      <div className="bg-card border rounded-2xl p-6 flex flex-col gap-5">
        <h2 className="font-bold text-lg">Questions by Subject</h2>
        <div className="flex flex-col gap-4">
          {subjectTotals.map((s) => {
            const pct = Math.round((s.total / totalQuestions) * 100);
            const colors = SUBJECT_COLORS[s.subject] ?? { bg: "bg-muted", text: "text-foreground", border: "border-border", dot: "bg-muted-foreground" };
            return (
              <div key={s.subject} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                    <span className="font-semibold">{s.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{s.total} Qs</span>
                    <span className={`text-xs font-bold ${colors.text}`}>{pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden relative">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full ${colors.dot} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject cards with topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjectTotals.map((s) => {
          const colors = SUBJECT_COLORS[s.subject] ?? { bg: "bg-muted", text: "text-foreground", border: "border-border", dot: "bg-muted-foreground" };
          const topics = bySubject[s.subject] ?? [];
          const boards = boardBySubject[s.subject] ?? [];
          const uniqueTopicList = [...new Set(topics.filter((t) => t.topic).map((t) => t.topic as string))];

          return (
            <div key={s.subject} className={`border rounded-2xl overflow-hidden ${colors.border}`}>
              {/* Subject header */}
              <div className={`px-6 py-5 ${colors.bg} flex items-center justify-between`}>
                <div>
                  <h3 className={`font-bold text-lg ${colors.text}`}>{s.subject}</h3>
                  <p className="text-sm text-muted-foreground">{s.total} questions</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  {boards.map((b) => (
                    <span key={b.board} className={`px-2 py-1 rounded-lg text-xs font-bold ${BOARD_COLORS[b.board] ?? "bg-muted text-muted-foreground"}`}>
                      {b.board} ({b.total})
                    </span>
                  ))}
                </div>
              </div>

              {/* Topics grid */}
              <div className="p-5 flex flex-col gap-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Topic Areas</p>
                {uniqueTopicList.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {uniqueTopicList.map((topic) => {
                      const topicCount = topics
                        .filter((t) => t.topic === topic)
                        .reduce((acc, t) => acc + t.count, 0);
                      return (
                        <a
                          key={topic}
                          href={`/search?q=${encodeURIComponent(topic)}`}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 hover:opacity-80 transition-opacity ${colors.bg} ${colors.text} border ${colors.border}`}
                        >
                          <span>{topic}</span>
                          <span className="opacity-60">· {topicCount}</span>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No topics tagged yet</p>
                )}

                <a
                  href={`/search?q=${encodeURIComponent(s.subject)}`}
                  className={`mt-2 text-xs font-semibold ${colors.text} hover:opacity-80 transition-opacity flex items-center gap-1`}
                >
                  Search all {s.subject} questions →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Board coverage */}
      <div className="bg-card border rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-5">Board Coverage</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {uniqueBoards.map((board) => {
            const boardTotal = boardTotals.filter((b) => b.board === board).reduce((acc, b) => acc + b.total, 0);
            const boardSubjects = boardTotals.filter((b) => b.board === board).map((b) => b.subject);
            return (
              <div key={board} className={`p-4 rounded-2xl border text-center ${BOARD_COLORS[board] ?? "bg-muted"}`}>
                <p className="font-bold text-lg">{boardTotal}</p>
                <p className="text-xs font-bold mt-0.5">{board}</p>
                <p className="text-xs opacity-60 mt-1">{boardSubjects.join(", ")}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
