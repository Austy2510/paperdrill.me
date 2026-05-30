"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toggleSavedQuestion, getSavedQuestionStatus } from "@/app/actions";

interface SaveBookmarkButtonProps {
  questionId: string;
  questionText?: string;
  board?: string;
  subject?: string;
  year?: number;
  topic?: string | null;
  questionNumber?: string;
  answerText?: string;
}

export default function SaveBookmarkButton(props: SaveBookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getSavedQuestionStatus(props.questionId).then((status) => {
      setSaved(status);
    });
  }, [props.questionId]);

  const toggle = () => {
    startTransition(async () => {
      try {
        const result = await toggleSavedQuestion(props.questionId);
        setSaved(result.saved);
      } catch (err) {
        console.error("Failed to toggle bookmark:", err);
      }
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      title={saved ? "Remove from saved" : "Save question"}
      className={`p-2 rounded-xl transition-all ${
        saved
          ? "bg-primary text-primary-foreground"
          : "bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}

