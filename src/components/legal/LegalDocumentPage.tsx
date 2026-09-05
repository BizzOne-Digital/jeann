import Image from "next/image";
import Link from "next/link";
import type { LegalDocument } from "@/lib/content/legal/types";
import { LegalDocumentBody } from "@/components/legal/LegalDocumentBody";
import { BRAND_LOGO_SRC } from "@/components/marketing/BrandLogo";

export type LegalDocumentKind = "privacy" | "terms";

const CROSS_LINKS: { kind: LegalDocumentKind; href: string; label: string }[] = [
  { kind: "privacy", href: "/privacy", label: "Privacy Policy" },
  { kind: "terms", href: "/terms", label: "Terms & Conditions" },
];

function formatDocLabel(title: string) {
  return title
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function LegalDocumentPage({
  document,
  kind,
}: {
  document: LegalDocument;
  kind: LegalDocumentKind;
}) {
  const showToc = document.sections.length >= 8;

  return (
    <div className="legal-shell flex min-h-screen flex-col">
      <div className="legal-quad-strip flex h-1 w-full print:hidden" aria-hidden>
        <span className="flex-1 bg-[#1b7a4a]" />
        <span className="flex-1 bg-[#1e4d8f]" />
        <span className="flex-1 bg-[#c41e3a]" />
        <span className="flex-1 bg-[#d4a017]" />
      </div>

      <header className="border-b border-[#d5d0c8]/80 bg-white/90 backdrop-blur-sm print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="focus-ring flex items-center gap-3 rounded-lg transition hover:opacity-90"
          >
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] ring-1 ring-[#d5d0c8]">
              <Image
                src={BRAND_LOGO_SRC}
                alt="Finekarts"
                width={44}
                height={44}
                className="h-full w-full rounded-full object-cover"
                priority
              />
            </span>
            <span className="hidden text-sm font-semibold text-[#001a3d] sm:inline">Finekarts</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Legal documents">
            {CROSS_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.kind === kind
                    ? "rounded-full bg-[#001a3d] px-3 py-1.5 text-xs font-semibold text-white sm:px-4 sm:text-sm"
                    : "focus-ring rounded-full px-3 py-1.5 text-xs font-medium text-[#555] transition hover:bg-[#f3f1ec] hover:text-[#001a3d] sm:px-4 sm:text-sm"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-[#d5d0c8] bg-white shadow-[0_8px_40px_rgba(0,26,61,0.08)] print:border-0 print:shadow-none">
            <div className="relative bg-gradient-to-br from-[#001a3d] via-[#002952] to-[#001a3d] px-6 py-10 text-center text-white sm:px-10 sm:py-12 print:bg-white print:text-black">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07] print:hidden"
                aria-hidden
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, #d4a017 0%, transparent 45%), radial-gradient(circle at 80% 70%, #1b7a4a 0%, transparent 40%)",
                }}
              />
              <p className="relative text-xs font-semibold tracking-[0.28em] text-[#d4a84b] uppercase print:text-[#666]">
                {document.company}
              </p>
              <h1 className="relative mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl print:text-2xl">
                {formatDocLabel(document.title)}
              </h1>
              <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm print:border-[#ccc] print:bg-transparent print:text-[#333]">
                  Effective {document.effectiveDate}
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm print:border-[#ccc] print:bg-transparent print:text-[#333]">
                  Updated {document.lastUpdated}
                </span>
              </div>
            </div>

            {showToc ? (
              <details className="group border-b border-[#e8e4dc] bg-[#faf9f6] px-6 py-4 sm:px-10 print:hidden">
                <summary className="cursor-pointer list-none text-sm font-semibold text-[#001a3d] marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-2">
                    Jump to a section
                    <span className="text-xs font-normal text-[#888] group-open:hidden">Show</span>
                    <span className="hidden text-xs font-normal text-[#888] group-open:inline">Hide</span>
                  </span>
                </summary>
                <ol className="mt-4 columns-1 gap-x-8 text-sm sm:columns-2">
                  {document.sections.map((section) => (
                    <li key={section.id} className="mb-2 break-inside-avoid">
                      <a
                        href={`#section-${section.id}`}
                        className="text-[#1e4d8f] underline-offset-2 hover:underline"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            ) : null}

            <div className="legal-document px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 print:px-8 print:py-8">
              <LegalDocumentBody document={document} />
            </div>
          </div>

          <footer className="mt-8 text-center print:mt-4">
            <p className="text-sm text-[#666]">
              Questions?{" "}
              <a
                href="mailto:Info@finekarts.com"
                className="font-medium text-[#1e4d8f] underline-offset-2 hover:underline"
              >
                Info@finekarts.com
              </a>
            </p>
            <Link
              href="/"
              className="focus-ring mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#d5d0c8] bg-white px-5 py-2.5 text-sm font-semibold text-[#001a3d] shadow-sm transition hover:border-[#c88e4a] hover:shadow print:hidden"
            >
              ← Back to Finekarts.com
            </Link>
            <p className="mt-6 text-xs text-[#999] print:mt-4">
              © {new Date().getFullYear()} Finekarts Inc. All rights reserved.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
