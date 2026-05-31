import React from "react";
import { Search } from "lucide-react";

export default function SearchLoading() {
  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full min-h-[60vh]">
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-muted/30 p-4 rounded-2xl border animate-pulse">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Search className="w-6 h-6 text-primary opacity-50" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-6 w-48 bg-muted rounded"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-card border rounded-2xl p-6 animate-pulse">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex gap-2">
                  <div className="h-6 w-24 bg-muted rounded-lg"></div>
                  <div className="h-6 w-20 bg-muted rounded-lg"></div>
                  <div className="h-6 w-28 bg-muted rounded-lg"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-12 bg-muted rounded-lg"></div>
                  <div className="h-6 w-10 bg-muted rounded-lg"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-[90%] bg-muted rounded"></div>
                <div className="h-4 w-[75%] bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
