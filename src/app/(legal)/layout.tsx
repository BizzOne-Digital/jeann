import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

/** Standalone legal documents — no site header, menu, or footer. */
export default function LegalDocumentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="legal-shell min-h-screen w-full bg-[#f3f1ec] text-[#1a1a1a] print:bg-white">
      {children}
    </div>
  );
}
