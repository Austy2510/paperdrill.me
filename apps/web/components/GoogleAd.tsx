"use client";

import { useEffect, useRef } from "react";

interface GoogleAdProps {
  client?: string;
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
  responsive?: boolean;
  className?: string;
}

export default function GoogleAd({ 
  client = "ca-pub-6392725786527871", 
  slot, 
  format = "auto", 
  responsive = true,
  className = "" 
}: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const adPushed = useRef(false);

  useEffect(() => {
    // Only push the ad once
    if (typeof window !== "undefined" && !adPushed.current && adRef.current) {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        adPushed.current = true;
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, []);

  return (
    <div className={`overflow-hidden rounded-xl border bg-muted/10 flex items-center justify-center text-center ${className}`}>
      {process.env.NODE_ENV === "development" ? (
        <div className="w-full h-full bg-card/50 border border-border/50 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 pointer-events-none" />
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-lg font-bold">Ad</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground font-inter">Advertisement</p>
              <p className="text-xs text-muted-foreground font-inter">Slot: {slot}</p>
            </div>
          </div>
        </div>
      ) : (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      )}
    </div>
  );
}
