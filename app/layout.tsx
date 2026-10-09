import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import { LanguageProvider } from "@/lib/LanguageContext";
import "./globals.css";

// HUD font for the islands (used via font-[family-name:var(--font-hud)]).
const hud = Chakra_Petch({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-hud" });

export const metadata: Metadata = {
  metadataBase: new URL('https://faradumatin.github.io/'),
  title: "Farah Mohamed - Software Developer Portfolio",
  description: "My software Developer Portfolio. View my projects including CollaBoard, uOttaMail, UnderPath and BorderMate.",
  keywords: ["Farah Mohamed", "Software Developer", "Portfolio", "React", "Next.js", "TypeScript"],
  authors: [{ name: "Farah Mohamed" }],
  creator: "Farah Mohamed",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://faradumatin.github.io/",
    title: "Farah Mohamed - Software Developer Portfolio",
    description: "A collection of Full-stack, 3D, and AI projects engineered for performance and user experience.",
    siteName: "Farah Mohamed Portfolio",
    images: [
      {
        url: '/og/og.png',
        width: 1200,
        height: 630,
        alt: 'Farah Mohamed - portfolio preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farah Mohamed - Software Developer Portfolio',
    description: 'A collection of Full-stack, 3D, and AI projects engineered for performance and user experience.',
    images: ['/og/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={hud.variable}>
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
