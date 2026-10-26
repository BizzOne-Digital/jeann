import {
  COMMODITY_TRADE_DOCUMENT_CHECKLIST_NOTE,
  COMMODITY_TRADE_DOCUMENT_CHECKLIST_SECTIONS,
  COMMODITY_TRADE_DOCUMENT_CHECKLIST_TITLE,
} from "@/lib/content/commodity-trade-document-checklist";
import { BUYER_CIS_PDF } from "@/lib/content/buyer-cis-download";

const CHECKLIST_DOWNLOAD_HREF = "/docs/commodity-trade-document-checklist.txt";

export type CommodityChecklistContent = {
  eyebrow: string;
  title: string;
  sections: { title: string; items: string[] }[];
  noteLabel: string;
  note: string;
};

export function CommodityTradeDocumentChecklist({
  showDownload = true,
  content,
}: {
  showDownload?: boolean;
  /** Optional CMS-resolved copy; falls back to the shared defaults. */
  content?: CommodityChecklistContent;
}) {
  const eyebrow = content?.eyebrow ?? "Reference checklist";
  const title = content?.title ?? COMMODITY_TRADE_DOCUMENT_CHECKLIST_TITLE;
  const sections = content?.sections ?? COMMODITY_TRADE_DOCUMENT_CHECKLIST_SECTIONS;
  const noteLabel = content?.noteLabel ?? "Important note";
  const note = content?.note ?? COMMODITY_TRADE_DOCUMENT_CHECKLIST_NOTE;
  return (
    <article className="marketing-box rounded-lg p-6 sm:p-8 shadow-sm">
      <header className="border-b border-[#ebe7e0] pb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#c88e4a] uppercase">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-[#001a3d] sm:text-2xl">
          {title}
        </h3>
        {showDownload ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={CHECKLIST_DOWNLOAD_HREF}
              download
              className="focus-ring inline-flex items-center rounded-md bg-[#1b3a5c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#13293d]"
            >
              Download checklist (text)
            </a>
            <a
              href={BUYER_CIS_PDF.href}
              download={BUYER_CIS_PDF.fileName}
              className="focus-ring inline-flex items-center rounded-md border border-[#1b3a5c] bg-white px-5 py-2.5 text-sm font-semibold text-[#1b3a5c] transition hover:bg-[#eef2f7]"
            >
              Download {BUYER_CIS_PDF.title} (PDF)
            </a>
          </div>
        ) : null}
      </header>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h4 className="text-sm font-semibold tracking-wide text-[#001a3d] uppercase">
              {section.title}
            </h4>
            <ul className="mt-3 space-y-2">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-[#555555]">
                  <span className="shrink-0 text-[#1b3a5c]" aria-hidden>☐</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-[#e8e4dc] bg-[#f9f8f5] p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-wide text-[#001a3d] uppercase">
          {noteLabel}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">
          {note}
        </p>
      </div>
    </article>
  );
}
