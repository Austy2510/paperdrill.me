import type { Metadata } from "next";
import "./globals.css";
import AdBlockDetector from "../components/AdBlockDetector";
import Script from "next/script";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "PaperDrill | AI-Powered Exam Preparation & Past Papers",
  description: "The ultimate platform for CAIE, Edexcel, and Dhaka Board exam paper discovery and AI-assisted learning. Get answers instantly.",
  keywords: ["past papers", "A Level", "O Level", "IGCSE", "AI Tutor", "exam preparation", "Dhaka Board"],
  openGraph: {
    title: "PaperDrill | AI-Powered Exam Preparation",
    description: "Discover past papers and get instant help from our AI Tutor.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6392725786527871"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AdBlockDetector />
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || "GTM-XXXXXXXX"} />
      </body>
    </html>
  );
}
