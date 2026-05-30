"use client";

import { useEffect, useState } from "react";

export default function AdBlockDetector() {
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  useEffect(() => {
    const checkAdBlock = () => {
      // Method 1: Honeypot element
      const bait = document.createElement("div");
      bait.className = "ad-banner adsbygoogle";
      bait.style.position = "absolute";
      bait.style.left = "-9999px";
      bait.style.height = "1px";
      bait.style.width = "1px";
      document.body.appendChild(bait);

      // Method 2: Fetching an 'ads.js' file (simulated here)
      const detect = setTimeout(() => {
        if (bait.offsetHeight === 0 || bait.style.display === "none" || bait.style.visibility === "hidden") {
          setAdBlockDetected(true);
        }
        document.body.removeChild(bait);
      }, 500);

      return () => clearTimeout(detect);
    };

    // Delay check slightly to let blockers do their job
    const timer = setTimeout(checkAdBlock, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!adBlockDetected) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      </div>
      <h1 className="text-2xl font-bold mb-4">Ad Blocker Detected</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        PaperDrill is free to use but supported by ads. Please disable your ad blocker or whitelist our site to continue using the platform.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
      >
        I have disabled it, refresh page
      </button>
    </div>
  );
}
