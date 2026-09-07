import type { LegalDocument } from "@/lib/content/legal/types";
import { LegalDocumentBody } from "@/components/legal/LegalDocumentBody";

export type LegalDocumentKind = "privacy" | "terms";

export function LegalDocumentPage({
  document,
}: {
  document: LegalDocument;
  kind?: LegalDocumentKind;
}) {
  return (
    <main className="legal-document min-h-screen bg-white text-black">
      <article className="mx-auto max-w-[8.5in] px-6 py-10 sm:px-12 sm:py-12">
        <header className="mb-8 border-b border-black/10 pb-6 text-center">
          <p className="text-sm font-bold tracking-wide uppercase">{document.company}</p>
          <h1 className="mt-3 text-lg font-bold sm:text-xl">{document.title}</h1>
          <p className="mt-4 text-sm leading-relaxed">
            Effective Date: {document.effectiveDate}
            <br />
            Last Updated: {document.lastUpdated}
          </p>
        </header>
        <LegalDocumentBody document={document} />
      </article>
    </main>
  );
}
