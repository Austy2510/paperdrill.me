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
  client = "ca-pub-XXXXXXXXXXXXXXXX", 
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
        <div className="p-4 text-xs text-muted-foreground w-full h-full flex flex-col items-center justify-center">
          <span className="font-bold">Google Ad</span>
          <span>Slot: {slot}</span>
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
