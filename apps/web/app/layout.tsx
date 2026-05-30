import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "PaperDrill | AI-Powered Exam Preparation",
  description: "The ultimate platform for exam paper discovery and AI-assisted learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased font-sans">
        <body className="min-h-full flex flex-col font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
