import Link from "next/link";
import { LEGAL_DOCUMENTS } from "@/lib/content/legal-documents";

export function LegalDocumentsPanel({
  category,
  documentIds,
  title = "Download legal documents (PDF)",
}: {
  category?: "website" | "trade" | "buyer";
  documentIds?: string[];
  title?: string;
}) {
  const docs = LEGAL_DOCUMENTS.filter((doc) => {
    if (documentIds?.length) return documentIds.includes(doc.id);
    if (category) return doc.category === category;
    return true;
  });

  return (
    <section className="mt-10 rounded-lg border border-[#d5d0c8] bg-white p-6">
      <h2 className="text-lg font-semibold text-[#001a3d]">{title}</h2>
      <p className="mt-2 text-sm text-[#666666]">
        Final counsel-approved PDFs are linked below. Until your legal team uploads them to{" "}
        <code className="text-xs">public/docs/legal/</code>, downloads may be unavailable — the web
        summary on this page remains visible.
      </p>
      <ul className="mt-5 space-y-3">
        {docs.map((doc) => (
          <li
            key={doc.id}
            className="flex flex-col gap-2 border-b border-[#ebe7e0] pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-[#001a3d]">{doc.title}</p>
              <p className="mt-0.5 text-sm text-[#666666]">{doc.description}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <a
                href={doc.pdfHref}
                download
                className="inline-flex items-center rounded-md border border-[#001a3d] px-3 py-2 text-sm font-semibold text-[#001a3d] transition hover:bg-[#001a3d] hover:text-white"
              >
                Download PDF
              </a>
              {doc.pageHref !== "/resources" ? (
                <Link
                  href={doc.pageHref}
                  className="inline-flex items-center text-sm font-medium text-[#c88e4a] hover:underline"
                >
                  Web version
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
