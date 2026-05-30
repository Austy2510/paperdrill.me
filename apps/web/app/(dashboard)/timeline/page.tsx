import React from "react";
import { Clock } from "lucide-react";

export default function TimelinePage() {
  return (
    <div className="p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full items-center justify-center min-h-[60vh]">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <Clock className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-foreground">Timeline</h1>
      <p className="text-muted-foreground text-center max-w-lg">
        This feature is coming soon! You will be able to see a timeline of your exam prep activities, goals, and upcoming milestones.
      </p>
    </div>
  );
}
