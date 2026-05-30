import React from "react";
import { Search, Bell } from "lucide-react";
import AITutor from "@/components/AITutor";
import DashboardSidebar from "@/components/DashboardSidebar";
import HeaderSearch from "@/components/HeaderSearch";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gradient-subtle overflow-y-auto">
        {/* Top Header */}
        <header className="p-6 flex items-center justify-between sticky top-0 z-10 glass border-b lg:border-none lg:bg-transparent">
          <HeaderSearch />
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2.5 rounded-xl bg-background border shadow-sm hover:bg-muted transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>
      
      {/* Global AI Tutor for the Dashboard */}
      <AITutor />
    </div>
  );
}
