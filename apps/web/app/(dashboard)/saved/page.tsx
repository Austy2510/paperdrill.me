"use client";

import { Bookmark, Trash2, BookOpen, Zap, Search, History } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SavedQuestion {
  questionId: string;
  questionText: string;
  board: string;
  subject: string;
  year: number;
  topic?: string | null;
  questionNumber: string;
  answerText: string;
}

const SUBJECT_COLORS: Record<string, string> = {
  Chemistry: "bg-emerald-500/10 text-emerald-600",
  Mathematics: "bg-blue-500/10 text-blue-600",
  Physics: "bg-purple-500/10 text-purple-600",
  Biology: "bg-rose-500/10 text-rose-600",
};

export default function SavedQuestionsPage() {
  const [saved, setSaved] = useState<SavedQuestion[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = JSON.parse(localStorage.getItem("savedQuestions") ?? "[]");
    setSaved(data);
  }, []);

  const removeQuestion = (id: string) => {
    const updated = saved.filter((q) => q.questionId !== id);
    setSaved(updated);
    localStorage.setItem("savedQuestions", JSON.stringify(updated));
  };

  const clearAll = () => {
    setSaved([]);
    localStorage.removeItem("savedQuestions");
  };

  const subjects = ["All", ...Array.from(new Set(saved.map((q) => q.subject)))];
  const filtered = filter === "All" ? saved : saved.filter((q) => q.subject === filter);

  if (!mounted) return null;

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full min-h-[60vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Saved Questions</h1>
            <p className="text-sm text-muted-foreground">
              {saved.length} question{saved.length !== 1 ? "s" : ""} saved for review
            </p>
          </div>
        </div>
        {saved.length > 0 && (
          <button
            onClick={clearAll}
            className="sm:ml-auto flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {saved.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center flex-1 min-h-[50vh] gap-6">
          <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center">
            <History className="w-12 h-12 text-muted-foreground/40" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">No saved questions yet</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Search for questions and click the bookmark icon to save them here for later review.
            </p>
          </div>
          <Link
            href="/search?q=algebra"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold hover:opacity-90 transition-opacity"
          >
            <Search className="w-4 h-4" />
            Browse Questions
          </Link>
        </div>
      ) : (
        <>
          {/* Subject filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  filter === s
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s}
                {s !== "All" && (
                  <span className="ml-1.5 opacity-70">
                    ({saved.filter((q) => q.subject === s).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from(new Set(saved.map((q) => q.subject))).map((subject) => {
              const count = saved.filter((q) => q.subject === subject).length;
              return (
                <div key={subject} className="bg-card border rounded-2xl p-4">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className={`text-xs font-medium mt-1 ${SUBJECT_COLORS[subject]?.split(" ")[1] ?? "text-muted-foreground"}`}>
                    {subject}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Questions list */}
          <div className="flex flex-col gap-4">
            {filtered.map((question) => (
              <div
                key={question.questionId}
                className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Card header */}
                <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                      {question.board} · {question.year}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${SUBJECT_COLORS[question.subject] ?? "bg-muted text-muted-foreground"}`}>
                      {question.subject}
                    </span>
                    {question.topic && (
                      <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-lg">
                        {question.topic}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
                      Q{question.questionNumber}
                    </span>
                    <button
                      onClick={() => removeQuestion(question.questionId)}
                      title="Remove from saved"
                      className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Question text */}
                <div className="px-6 pb-4">
                  <div className="flex gap-2">
                    <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-line">
                      {question.questionText}
                    </p>
                  </div>
                </div>

                {/* Answer - collapsible */}
                <details className="group/details">
                  <summary className="px-6 pb-4 cursor-pointer list-none">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Show Model Answer</span>
                      <span className="ml-auto group-open/details:rotate-180 transition-transform">▼</span>
                    </div>
                  </summary>
                  <div className="px-6 pb-5 pt-2 border-t bg-muted/20">
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line font-mono">
                      {question.answerText}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
