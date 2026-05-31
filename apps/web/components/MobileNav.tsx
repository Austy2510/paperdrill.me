"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bookmark, BookOpen } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", icon: Home, href: "/" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Saved", icon: Bookmark, href: "/saved" },
  { label: "Syllabus", icon: BookOpen, href: "/syllabus" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t flex items-center justify-around p-3 z-50">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-1 p-2 ${active ? "text-primary" : "text-muted-foreground"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-inter">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
