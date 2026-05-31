"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Search error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center max-w-md mx-auto">
      <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-3xl flex items-center justify-center mb-6 shadow-sm">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-8">
        We encountered an error while searching the database. Please try again or go back to the homepage.
      </p>
      
      <div className="flex gap-4 w-full justify-center">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl font-bold transition-all text-sm"
        >
          Try Again
        </button>
        <Link 
          href="/"
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all text-sm flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back Home
        </Link>
      </div>
    </div>
  );
}
