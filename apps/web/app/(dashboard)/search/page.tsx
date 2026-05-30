import React from "react";
import { Search, BookOpen, Zap, Filter } from "lucide-react";
import { db, questionsTable } from "@workspace/db";
import { ilike, or, desc, eq } from "drizzle-orm";
import SaveBookmarkButton from "@/components/SaveBookmarkButton";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
  const q = params.q as string | undefined;
  const subject = params.subject as string | undefined;
  const board = params.board as string | undefined;

  let results: typeof questionsTable.$inferSelect[] = [];

  if (q && q.trim() !== "") {
    const searchTerm = `%${q}%`;
    const conditions = [
      or(
        ilike(questionsTable.questionText, searchTerm),
        ilike(questionsTable.topic, searchTerm),
        ilike(questionsTable.subject, searchTerm),
        ilike(questionsTable.answerText, searchTerm),
      ),
    ];

    results = await db
      .select()
      .from(questionsTable)
      .where(or(...conditions))
      .orderBy(desc(questionsTable.year))
      .limit(30);

    // Apply client filters
    if (subject) results = results.filter((r) => r.subject === subject);
    if (board) results = results.filter((r) => r.board === board);
  }

  const subjects = [...new Set(results.map((r) => r.subject))];
  const boards = [...new Set(results.map((r) => r.board))];

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full min-h-[60vh]">
      {!q && (
        <div className="flex flex-col items-center justify-center flex-1 w-full mt-20 gap-8">
          <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Search className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Advanced Search</h1>
            <p className="text-muted-foreground text-center max-w-lg mt-3">
              Search across thousands of past paper questions from CAIE, Edexcel, AQA, IB, and more.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
            {["algebra", "photosynthesis", "electrolysis", "kinematics"].map((term) => (
              <a
                key={term}
                href={`/search?q=${term}`}
                className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-sm text-center font-medium transition-colors capitalize"
              >
                {term}
              </a>
            ))}
          </div>
        </div>
      )}

      {q && (
        <div className="w-full flex flex-col gap-6">
          {/* Results header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-muted/30 p-4 rounded-2xl border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Search Results</h1>
              <p className="text-sm text-muted-foreground">
                Found <span className="font-bold text-foreground">{results.length}</span> results for{" "}
                <span className="font-bold text-primary">"{q}"</span>
              </p>
            </div>
            {results.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {subjects.map((s) => (
                  <span key={s} className={`px-2 py-1 rounded-lg text-xs font-medium ${SUBJECT_COLORS[s] ?? "bg-muted"}`}>
                    {s}
                  </span>
                ))}
                {boards.map((b) => (
                  <span key={b} className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Results grid */}
          <div className="flex flex-col gap-4">
            {results.length > 0 ? (
              results.map((question) => (
                <div
                  key={question.id}
                  className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
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
                      {question.difficulty && (
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${DIFFICULTY_COLORS[question.difficulty] ?? "bg-muted"}`}>
                          {question.difficulty}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
                        Q{question.questionNumber}
                      </span>
                      {question.marks && (
                        <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                          {question.marks}m
                        </span>
                      )}
                      <SaveBookmarkButton
                        questionId={question.id}
                        questionText={question.questionText}
                        board={question.board}
                        subject={question.subject}
                        year={question.year}
                        topic={question.topic}
                        questionNumber={question.questionNumber}
                        answerText={question.answerText}
                      />
                    </div>
                  </div>

                  {/* Question text */}
                  <div className="px-6 pb-4">
                    <div className="flex gap-2 mb-2">
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
              ))
            ) : (
              <div className="text-center p-16 bg-muted/20 border border-dashed rounded-2xl">
                <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No questions found matching "{q}"</p>
                <p className="text-sm text-muted-foreground mt-1">Try different keywords or check spelling</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
