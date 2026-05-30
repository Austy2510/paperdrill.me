import React from "react";
import { TrendingUp } from "lucide-react";

export default function SyllabusMapPage() {
  return (
    <div className="p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full items-center justify-center min-h-[60vh]">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <TrendingUp className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-foreground">Syllabus Map</h1>
      <p className="text-muted-foreground text-center max-w-lg">
        This feature is coming soon! You will be able to visualize your progress across different subjects and see which topics you need to focus on.
      </p>
    </div>
  );
}
