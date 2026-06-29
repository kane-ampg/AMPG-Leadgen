import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { THEME_BOOTSTRAP } from "@/lib/theme";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Monospace numerals are the typographic signature — the dashboard reads its
// numbers like an instrument (ui-standards §13: font-mono + tabular-nums).
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "APMG Services — Lead Generation",
  description:
    "Live lead-generation telemetry for APMG Services: volume, conversion, and cost per lead at a glance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply persisted/default-dark theme before paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
