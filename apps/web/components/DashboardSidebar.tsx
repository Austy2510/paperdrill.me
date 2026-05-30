"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  History, 
  TrendingUp, 
  LayoutGrid, 
  Settings,
  BookOpen,
  Clock,
  User
} from "lucide-react";
import GoogleAd from "./GoogleAd";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [deviceId, setDeviceId] = useState<string>("Loading...");

  useEffect(() => {
    // Just a fun way to show the user's local ID
    const match = document.cookie.match(/(?:^|; )deviceId=([^;]+)/);
    if (match) {
      setDeviceId(match[1].substring(0, 8) + "...");
    } else {
      setDeviceId("Anonymous");
    }
  }, []);

  const navItems = [
    { icon: LayoutGrid, label: "Overview", href: "/" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: History, label: "Saved", href: "/saved" },
    { icon: TrendingUp, label: "Syllabus", href: "/syllabus" },
    { icon: Clock, label: "Timeline", href: "/timeline" },
  ];

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t lg:static lg:w-64 lg:border-r lg:border-t-0 lg:bg-muted/20 flex flex-row lg:flex-col items-center lg:items-start p-2 lg:p-6 gap-2 lg:gap-8 shrink-0 pb-safe">
      <Link href="/" className="hidden lg:flex items-center gap-3">
        <div className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gradient">PaperDrill</span>
      </Link>

      <nav className="flex-1 w-full flex flex-row lg:flex-col justify-around lg:justify-start gap-1 lg:gap-2">
        {navItems.map((item, i) => {
          const active = pathname === item.href;
          return (
            <Link 
              key={i} 
              href={item.href}
              className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-4 w-full p-2 lg:p-3 rounded-xl transition-all ${active ? 'text-primary lg:bg-primary lg:text-primary-foreground shadow-none lg:shadow-lg lg:shadow-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="text-[10px] lg:text-sm font-medium whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden lg:flex w-full pt-6 border-t flex-col gap-4">
        <GoogleAd slot="sidebar-bottom-ad" className="min-h-[100px] w-full" />
        <div className="flex items-center gap-4 w-full p-3 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <User className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-bold truncate">Student ID:</p>
            <p className="text-[9px] text-muted-foreground truncate">{deviceId}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
