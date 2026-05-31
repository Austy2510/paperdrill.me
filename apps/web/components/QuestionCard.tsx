"use client";

import { useState } from "react";
import { Lock, Play, Sparkles, Bookmark, FlaskConical, Atom, Calculator, Divide, Microscope } from "lucide-react";
import { useSavedQuestions, useAiUnlock } from "@/lib/store";
import { AiUnlockModal } from "./AiUnlockModal";
import SaveBookmarkButton from "./SaveBookmarkButton";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

const SUBJECT_ICONS: Record<string, any> = {
  "Chemistry": FlaskConical,
  "Physics": Atom,
  "Mathematics": Calculator,
  "Biology": Microscope,
  "Economics": Divide,
};

interface QuestionCardProps {
  question: {
    id: string;
    subject: string;
    board: string;
    year: string | number;
    text?: string;
    questionText?: string;
    answer?: string;
    answerText?: string;
    marks?: number | null;
    topic?: string | null;
    questionNumber?: number | null;
  };
}

export function QuestionCard({ question }: QuestionCardProps) {
  const { isUnlocked, unlockAi } = useAiUnlock();
  const [showModal, setShowModal] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const Icon = SUBJECT_ICONS[question.subject] || FlaskConical;

  // Handle both possible property names for text and answer
  const qText = question.questionText || question.text || "";
  const aText = question.answerText || question.answer || "";

  return (
    <div className="group flex flex-col bg-card/80 backdrop-blur border hover:border-primary/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1" data-testid={`card-question-${question.id}`}>
      <div className="px-5 py-4 border-b flex items-center justify-between bg-muted/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-foreground text-sm">{question.subject}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase bg-muted text-muted-foreground border">{question.board}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase bg-muted text-muted-foreground border">{question.year}</span>
          <div className="ml-2">
            <SaveBookmarkButton
              questionId={question.id}
              questionText={qText}
              board={question.board}
              subject={question.subject}
              year={String(question.year)}
              topic={question.topic}
              questionNumber={question.questionNumber}
              answerText={aText}
            />
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 bg-background relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-primary/20" />
        <div className="font-playfair text-foreground/80 text-base leading-relaxed pl-4 relative z-10 group-hover:text-foreground transition-colors whitespace-pre-line">
          <Latex strict={false}>{qText}</Latex>
        </div>

        {showAnswer && isUnlocked && (
          <div className="mt-6 pl-4 relative z-10">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium text-sm font-inter">AI Model Answer</span>
              </div>
              <div className="text-muted-foreground font-mono text-sm leading-relaxed whitespace-pre-line overflow-x-auto">
                <Latex strict={false}>{aText}</Latex>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t flex items-center justify-between bg-muted/5">
        <span className="text-sm font-medium text-muted-foreground font-inter">
          {question.marks ? `[${question.marks} marks]` : "Question"}
        </span>
        
        {isUnlocked ? (
          <button 
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
            data-testid={`button-view-answer-${question.id}`}
          >
            <Sparkles className="w-4 h-4" />
            {showAnswer ? "Hide AI Answer" : "View AI Answer"}
          </button>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground border border-border hover:border-primary/40 bg-muted/20 hover:bg-primary/5 rounded-lg px-3 py-1.5 transition-all group cursor-pointer"
            data-testid={`button-unlock-ai-${question.id}`}
          >
            <Lock className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span>Watch Ad · Unlock 2hrs AI</span>
            <Play className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" fill="currentColor" />
          </button>
        )}
      </div>

      <AiUnlockModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onUnlock={() => {
          unlockAi();
          setShowModal(false);
          setShowAnswer(true);
        }} 
      />
    </div>
  );
}
