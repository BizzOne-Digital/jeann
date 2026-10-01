import { BUYER_CIS_PDF } from "@/lib/content/buyer-cis-download";

export function BuyerCisPdfDownload() {
  return (
    <div className="mb-6 rounded-lg border border-[var(--line)] bg-[#fff9eb] p-5">
      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--navy)] uppercase">
        Blank form
      </p>
      <p className="mt-2 text-sm font-semibold text-[var(--navy)]">{BUYER_CIS_PDF.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--stone)]">{BUYER_CIS_PDF.description}</p>
      <a
        href={BUYER_CIS_PDF.href}
        download={BUYER_CIS_PDF.fileName}
        className="focus-ring mt-4 inline-flex items-center rounded-md bg-[var(--navy)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Download CIS (PDF)
      </a>
    </div>
  );
}
