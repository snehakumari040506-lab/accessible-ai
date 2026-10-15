import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF7F2",
};

export const metadata: Metadata = {
  title: "AccessAble AI — Automated Accessibility for Public Digital Services",
  description: "Find website accessibility barriers, translate WCAG guidelines into plain language, and help developers fix them with confidence. A kinder, inclusive web for everyone.",
  keywords: [
    "accessibility",
    "a11y",
    "WCAG 2.2",
    "public digital services",
    "civic tech",
    "screen reader testing",
    "color contrast",
    "automated audit"
  ],
  authors: [{ name: "AccessAble AI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#1C1917] selection:bg-purple-200 selection:text-purple-950">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
