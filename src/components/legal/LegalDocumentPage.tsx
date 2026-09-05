import type { LegalDocument } from "@/lib/content/legal/types";
import { LegalDocumentBody } from "@/components/legal/LegalDocumentBody";

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <article className="legal-document mx-auto max-w-[816px] bg-white px-6 py-10 text-[#1a1a1a] sm:px-10 sm:py-14 print:max-w-none print:px-8 print:py-8">
      <header className="border-b border-black/15 pb-8 text-center">
        <p className="text-sm font-bold tracking-[0.12em]">{document.company}</p>
        <h1 className="mt-5 text-xl font-bold tracking-wide uppercase sm:text-2xl">
          {document.title}
        </h1>
        <div className="mt-5 space-y-1 text-sm text-[#333]">
          <p>
            <span className="font-semibold">Effective Date:</span> {document.effectiveDate}
          </p>
          <p>
            <span className="font-semibold">Last Updated:</span> {document.lastUpdated}
          </p>
        </div>
      </header>

      <LegalDocumentBody document={document} />
    </article>
  );
}
