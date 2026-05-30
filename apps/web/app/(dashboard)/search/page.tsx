import React from "react";
import { Search } from "lucide-react";
import { db, questionsTable } from "@workspace/db";
import { ilike, or, desc } from "drizzle-orm";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdvancedSearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.q as string | undefined;

  let results: typeof questionsTable.$inferSelect[] = [];
  
  if (q && q.trim() !== "") {
    const searchTerm = `%${q}%`;
    results = await db
      .select()
      .from(questionsTable)
      .where(
        or(
          ilike(questionsTable.questionText, searchTerm),
          ilike(questionsTable.topic, searchTerm)
        )
      )
      .orderBy(desc(questionsTable.year))
      .limit(20);
  }

  return (
    <div className="p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full items-center min-h-[60vh]">
      {!q && (
        <div className="flex flex-col items-center justify-center flex-1 w-full mt-20">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Advanced Search</h1>
          <p className="text-muted-foreground text-center max-w-lg mt-4">
            Search for specific questions, topics, or keywords.
          </p>
        </div>
      )}

      {q && (
        <div className="w-full flex flex-col gap-6">
          <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-2xl border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Search Results</h1>
              <p className="text-sm text-muted-foreground">
                Found {results.length} results for <span className="font-bold text-primary">"{q}"</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.length > 0 ? (
              results.map((question) => (
                <div key={question.id} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md">
                        {question.board} {question.year}
                      </span>
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-md">
                        {question.subject}
                      </span>
                      {question.topic && (
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs font-medium rounded-md">
                          {question.topic}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                      Q{question.questionNumber}
                    </span>
                  </div>
                  <div className="text-sm font-medium line-clamp-3">
                    {question.questionText}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center p-12 bg-muted/20 border border-dashed rounded-2xl">
                <p className="text-muted-foreground">No questions found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
