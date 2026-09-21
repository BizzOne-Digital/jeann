import {
  COMMODITY_TRADE_DOCUMENT_CHECKLIST_NOTE,
  COMMODITY_TRADE_DOCUMENT_CHECKLIST_SECTIONS,
  COMMODITY_TRADE_DOCUMENT_CHECKLIST_TITLE,
} from "@/lib/content/commodity-trade-document-checklist";

const CHECKLIST_DOWNLOAD_HREF = "/docs/commodity-trade-document-checklist.txt";

export function CommodityTradeDocumentChecklist({ showDownload = true }: { showDownload?: boolean }) {
  return (
    <article className="marketing-box rounded-lg p-6 sm:p-8 shadow-sm">
      <header className="border-b border-[#ebe7e0] pb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#c88e4a] uppercase">
          Reference checklist
        </p>
        <h3 className="mt-2 text-xl font-semibold text-[#001a3d] sm:text-2xl">
          {COMMODITY_TRADE_DOCUMENT_CHECKLIST_TITLE}
        </h3>
        {showDownload ? (
          <a
            href={CHECKLIST_DOWNLOAD_HREF}
            download
            className="focus-ring mt-4 inline-flex items-center rounded-md bg-[#1b3a5c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#13293d]"
          >
            Download plain-text copy
          </a>
        ) : null}
      </header>

      <div className="mt-8 space-y-8">
        {COMMODITY_TRADE_DOCUMENT_CHECKLIST_SECTIONS.map((section, index) => (
          <section key={section.title}>
            <h4 className="text-sm font-semibold tracking-wide text-[#001a3d] uppercase">
              {index + 1}. {section.title}
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
          Important note
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">
          {COMMODITY_TRADE_DOCUMENT_CHECKLIST_NOTE}
        </p>
      </div>
    </article>
  );
}
