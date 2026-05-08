import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const SITE_NAME = "Black Dog · The Founder Platform";
const SITE_DESC =
  "Pitch. Score. Fund. — 30 years of operator-investor judgment from Scott Kelly, encoded as a learning platform with the partner-grade PitchOS scoring engine.";

export const metadata: Metadata = {
  metadataBase: new URL("https://platform.blackdogvp.local"),
  title: {
    default: SITE_NAME,
    template: "%s · Black Dog",
  },
  description: SITE_DESC,
  applicationName: "Black Dog · Founder Platform",
  authors: [{ name: "Scott Kelly · Black Dog VP" }],
  keywords: [
    "PitchOS",
    "Black Dog VP",
    "Scott Kelly",
    "VC Fast Pitch",
    "Emerging Managers",
    "founder platform",
    "partner memo",
    "pitch deck scoring",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESC,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESC,
    creator: "@blackdogceo",
  },
  robots: {
    index: false, // prototype · do not index
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
