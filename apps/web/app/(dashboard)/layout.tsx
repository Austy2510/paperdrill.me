import React from "react";
import { Bell } from "lucide-react";
import AITutor from "@/components/AITutor";
import DashboardSidebar from "@/components/DashboardSidebar";
import HeaderSearch from "@/components/HeaderSearch";
import SEOFooter from "@/components/SEOFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans overflow-hidden relative">
      <div className="texture-bg" />

      {/* Sidebar Desktop */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-transparent overflow-y-auto z-10 pb-24 md:pb-0">
        {/* Top Header */}
        <header className="p-4 lg:p-6 flex items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border/50 lg:border-none lg:bg-transparent">
          <HeaderSearch />
          <div className="flex items-center gap-2 lg:gap-4 ml-auto">
            <ThemeToggle />
            <button className="p-2.5 rounded-xl bg-card border border-border shadow-sm hover:bg-muted transition-colors relative cursor-pointer">
              <Bell className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        {children}

        {/* SEO Footer */}
        <SEOFooter />
      </main>
      
      {/* Mobile Bottom Nav */}
      <MobileNav />

      {/* Global AI Tutor for the Dashboard */}
      <AITutor />
    </div>
  );
}
