"use client";

import { useState, useEffect } from "react";
import { Timer, X } from "lucide-react";

interface AiUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export function AiUnlockModal({ isOpen, onClose, onUnlock }: AiUnlockModalProps) {
  const [timeLeft, setTimeLeft] = useState(28);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(28);
      return;
    }

    if (timeLeft <= 0) {
      onUnlock();
      onClose();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, timeLeft]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" data-testid="modal-ai-unlock">
      <div className="bg-card border rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          data-testid="button-close-modal"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
            <Timer className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-foreground mb-2">Ad playing...</h2>
          <p className="text-sm text-muted-foreground font-inter mb-6">
            PaperDrill is free. Support us by watching a short video ad to unlock AI-powered model answers and step-by-step solutions for the next 24 hours!
          </p>
          
          <div className="text-4xl font-bold font-inter text-primary">
            {timeLeft}s
          </div>
        </div>
      </div>
    </div>
  );
}
