import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useAiUnlock() {
  const [unlockExpiry, setUnlockExpiry] = useLocalStorage<number | null>("paperdrill_ai_expiry", null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState(0);

  useEffect(() => {
    const checkExpiry = () => {
      if (!unlockExpiry) {
        setIsUnlocked(false);
        setTimeLeftMs(0);
        return;
      }
      
      const now = Date.now();
      if (now > unlockExpiry) {
        setUnlockExpiry(null);
        setIsUnlocked(false);
        setTimeLeftMs(0);
      } else {
        setIsUnlocked(true);
        setTimeLeftMs(unlockExpiry - now);
      }
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 1000);
    return () => clearInterval(interval);
  }, [unlockExpiry, setUnlockExpiry]);

  const unlockAi = () => {
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    setUnlockExpiry(Date.now() + twoHoursInMs);
  };

  const formatTimeLeft = () => {
    if (!isUnlocked || timeLeftMs <= 0) return "0h 0m";
    const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  return { isUnlocked, unlockAi, formatTimeLeft };
}

export function useSavedQuestions() {
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("paperdrill_saved_questions", []);

  const toggleSaved = (id: string) => {
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const isSaved = (id: string) => savedIds.includes(id);

  return { savedIds, toggleSaved, isSaved };
}
