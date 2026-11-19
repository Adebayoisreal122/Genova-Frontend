import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";

// Self-hosted by Next at build time: no render-blocking request to fonts.googleapis.com.
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Genova AI — generate, cut out and upscale images", template: "%s · Genova AI" },
  description:
    "Generate images from text, remove backgrounds and upscale up to 4× — one studio, one gallery.",
};

export const viewport: Viewport = {
  themeColor: "#050508",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
