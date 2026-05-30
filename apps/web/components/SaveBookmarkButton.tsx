"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";

interface SaveBookmarkButtonProps {
  questionId: string;
  questionText: string;
  board: string;
  subject: string;
  year: number;
  topic?: string | null;
  questionNumber: string;
  answerText: string;
}

export default function SaveBookmarkButton(props: SaveBookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("savedQuestions") ?? "[]");
    setSaved(existing.some((q: { id: string }) => q.id === props.questionId));
  }, [props.questionId]);

  const toggle = () => {
    const existing: SaveBookmarkButtonProps[] = JSON.parse(
      localStorage.getItem("savedQuestions") ?? "[]"
    );
    if (saved) {
      const updated = existing.filter((q) => q.questionId !== props.questionId);
      localStorage.setItem("savedQuestions", JSON.stringify(updated));
      setSaved(false);
    } else {
      localStorage.setItem(
        "savedQuestions",
        JSON.stringify([...existing, props])
      );
      setSaved(true);
    }
  };

  return (
    <button
      onClick={toggle}
      title={saved ? "Remove from saved" : "Save question"}
      className={`p-2 rounded-xl transition-all ${
        saved
          ? "bg-primary text-primary-foreground"
          : "bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary"
      }`}
    >
      <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
