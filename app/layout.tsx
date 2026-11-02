import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mirr — Become who you said you'd be",
  description: "Understand what's holding you back. Build better habits. Make progress, one day at a time — without shame, guilt, or artificial pressure.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://mirr.app"),
  openGraph: {
    title: "Mirr — Become who you said you'd be",
    description: "Understand what's holding you back. Build better habits. Make progress, one day at a time.",
    url: "https://mirr.app",
    siteName: "Mirr",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mirr — Become who you said you'd be",
    description: "Understand what's holding you back. Build better habits. Make progress, one day at a time.",
  },
};

export const viewport: Viewport = {
  themeColor: "#13110F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${inter.variable}`}>
      <body className="bg-ink text-paper antialiased font-sans selection:bg-gold/20 selection:text-paper">
        {children}
      </body>
    </html>
  );
}

