import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import { IntroGate } from "@/components/motion/IntroGate";
import "./globals.css";

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  title: {
    default: "Finekarts Incorporated | Global Agricultural Commodity Trading",
    template: "%s | Finekarts Incorporated",
  },
  description:
    "Finekarts Incorporated sources and supplies bulk agricultural commodities for qualified international buyers. Sign in to submit RFQs — no public fixed pricing.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }, { url: "/favicon.svg" }],
  },
  openGraph: {
    type: "website",
    siteName: "Finekarts Incorporated",
    title: "Finekarts Incorporated | Global Agricultural Commodity Trading",
    description:
      "Bulk edible oils, sugar, beans, rice, and more. RFQ-driven commodity trading for qualified counterparties.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable} h-full overflow-x-clip`}
    >
      <body className="min-h-full w-full max-w-full overflow-x-clip antialiased">
        <IntroGate />
        {children}
      </body>
    </html>
  );
}
