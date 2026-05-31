"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  Bookmark, 
  BookOpen, 
  BookMarked,
  Play
} from "lucide-react";
import { useAiUnlock } from "@/lib/store";
import { AiUnlockModal } from "./AiUnlockModal";

const NAV_ITEMS = [
  { label: "Overview", icon: Home, href: "/" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Saved", icon: Bookmark, href: "/saved" },
  { label: "Syllabus", icon: BookOpen, href: "/syllabus" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { isUnlocked, formatTimeLeft, unlockAi } = useAiUnlock();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <aside className="w-64 bg-card/80 backdrop-blur-md border-r border-border flex-col pt-8 pb-6 px-4 z-10 hidden md:flex flex-shrink-0 h-screen sticky top-0">
        <Link href="/" className="flex items-center gap-3 px-2 mb-12">
          <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-primary" />
          </div>
          <span className="font-playfair text-xl font-bold tracking-wide text-foreground">PaperDrill</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.label} 
                href={item.href} 
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  active 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`} 
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-primary" : "opacity-70"}`} />
                <span className="font-inter text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* AI Access Status */}
        <div className="px-3 mt-auto">
          <div className="p-4 rounded-xl bg-gradient-to-b from-card to-background border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${isUnlocked ? "bg-primary" : "bg-muted-foreground"}`} />
              <span className="font-inter text-xs font-semibold text-foreground/80">
                {isUnlocked ? `AI Unlocked · ${formatTimeLeft()}` : "AI Answers Locked"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-inter mb-3">
              {isUnlocked ? "You have full AI access for this session." : "Watch a short ad to unlock AI model answers for 2 hours. Free forever."}
            </p>
            {!isUnlocked && (
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-2 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-medium rounded text-xs transition-colors cursor-pointer"
                data-testid="button-sidebar-unlock-ai"
              >
                <Play className="w-3 h-3" fill="currentColor" />
                Watch Ad · Unlock 2hrs
              </button>
            )}
          </div>
        </div>
      </aside>

      <AiUnlockModal isOpen={showModal} onClose={() => setShowModal(false)} onUnlock={unlockAi} />
    </>
  );
}
