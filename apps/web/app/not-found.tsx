import React from "react";
import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — PaperDrill",
  description: "The page you are looking for does not exist. Browse our free past paper questions or search by topic.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-2">
          <p className="text-8xl font-black text-primary/20">404</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Page Not Found</h1>
          <p className="text-muted-foreground leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Try searching for past paper questions instead.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-2 px-6 py-3 bg-muted rounded-xl font-bold text-sm hover:bg-muted/80 transition-colors"
          >
            <Search className="w-4 h-4" />
            Search Questions
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Looking for CAIE, Edexcel or IGCSE past papers?{" "}
          <Link href="/search" className="text-primary font-bold hover:underline">
            Search here →
          </Link>
        </p>
      </div>
    </main>
  );
}
