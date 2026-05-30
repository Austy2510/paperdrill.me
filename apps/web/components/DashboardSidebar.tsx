"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  History, 
  TrendingUp, 
  LayoutGrid, 
  Settings,
  BookOpen,
  Clock
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

export default function DashboardSidebar() {
  const { user, isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutGrid, label: "Overview", href: "/" },
    { icon: Search, label: "Advanced Search", href: "/search" },
    { icon: History, label: "Saved Questions", href: "/saved" },
    { icon: TrendingUp, label: "Syllabus Map", href: "/syllabus" },
    { icon: Clock, label: "Timeline", href: "/timeline" },
  ];

  return (
    <aside className="w-20 lg:w-64 border-r bg-muted/20 flex flex-col items-center lg:items-start p-4 lg:p-6 gap-8 shrink-0">
      <Link href="/" className="flex items-center gap-3">
        <div className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight hidden lg:block text-gradient">PaperDrill</span>
      </Link>

      <nav className="flex-1 w-full flex flex-col gap-2">
        {navItems.map((item, i) => {
          const active = pathname === item.href;
          return (
            <Link 
              key={i} 
              href={item.href}
              className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all ${active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="font-medium hidden lg:block whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="w-full pt-6 border-t flex flex-col gap-2">
        <button className="flex items-center gap-4 w-full p-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground">
          <Settings className="w-5 h-5 shrink-0" />
          <span className="font-medium hidden lg:block">Settings</span>
        </button>
        <div className="flex items-center gap-4 w-full p-3 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
          {!isLoaded ? (
            <div className="flex items-center gap-4 w-full animate-pulse">
              <div className="w-8 h-8 rounded-full bg-muted-foreground/20"></div>
              <div className="hidden lg:block space-y-2 flex-1">
                <div className="h-3 bg-muted-foreground/20 rounded w-2/3"></div>
                <div className="h-2 bg-muted-foreground/20 rounded w-1/2"></div>
              </div>
            </div>
          ) : isSignedIn ? (
            <>
              <UserButton afterSignOutUrl="/" />
              <div className="hidden lg:block overflow-hidden">
                <p className="text-[11px] font-bold truncate">{user?.fullName || "Student"}</p>
                <p className="text-[9px] text-muted-foreground truncate">Student Account</p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-bold hidden lg:block">Sign in required</span>
              <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">?</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
