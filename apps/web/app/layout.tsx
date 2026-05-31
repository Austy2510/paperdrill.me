import type { Metadata, Viewport } from "next";
import "./globals.css";
import AdBlockDetector from "../components/AdBlockDetector";
import Script from "next/script";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const SITE_URL = "https://www.paperdrill.me";
const SITE_NAME = "PaperDrill";
const SITE_DESCRIPTION =
  "Free CAIE, Edexcel & Dhaka Board past papers with AI-powered answers. Search thousands of A Level, O Level & IGCSE questions by topic, get instant model answers, and ace your exams.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e1a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PaperDrill — Free Past Papers & AI Answers | CAIE, Edexcel, IGCSE",
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "past papers",
    "CAIE past papers",
    "Edexcel past papers",
    "IGCSE past papers",
    "A Level past papers",
    "O Level past papers",
    "AS Level past papers",
    "past paper answers",
    "mark scheme",
    "model answers",
    "AI tutor",
    "exam preparation",
    "Dhaka Board past papers",
    "Cambridge past papers",
    "Chemistry past papers",
    "Physics past papers",
    "Mathematics past papers",
    "Biology past papers",
    "topical past papers",
    "past paper questions by topic",
    "free past papers online",
    "CAIE A Level Chemistry",
    "Edexcel IAL Physics",
    "IGCSE Mathematics past papers",
  ],
  authors: [{ name: "PaperDrill", url: SITE_URL }],
  creator: "PaperDrill",
  publisher: "PaperDrill",
  applicationName: "PaperDrill",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    title: "PaperDrill — Free Past Papers & AI Answers | CAIE, Edexcel, IGCSE",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PaperDrill — AI-Powered Exam Preparation Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PaperDrill — Free Past Papers & AI Answers",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@paperdrill",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  category: "education",
  verification: {
    google: "dfLfG6CzmXnDCb9q_62ktdl5nth6Q5QWSZHxeqgyZNY",
  },
};

// JSON-LD Structured Data
function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: "en-US",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
        },
        sameAs: [
          "https://twitter.com/paperdrill",
          "https://www.linkedin.com/company/paperdrill",
          "https://www.facebook.com/paperdrill",
          "https://www.instagram.com/paperdrill"
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: "PaperDrill — Free Past Papers & AI Answers",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        description: SITE_DESCRIPTION,
        inLanguage: "en-US",
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#eduorg`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "AI-powered exam preparation platform providing free past papers and model answers for CAIE, Edexcel, and Dhaka Board exams.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <WebsiteJsonLd />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6392725786527871"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AdBlockDetector />
          {children}
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || "GTM-XXXXXXXX"} />
        </ThemeProvider>
      </body>
    </html>
  );
}
