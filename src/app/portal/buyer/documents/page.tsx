import Link from "next/link";
import { BuyerCisPdfDownload } from "@/components/portal/BuyerCisPdfDownload";
import { BuyerLoiUploadPanel } from "@/components/portal/BuyerLoiUploadPanel";
import { PortalPage } from "@/components/portal/PortalPage";

export default function DocumentsPage() {
  return (
    <PortalPage
      title="Documents"
      description="CIS qualification, LOI uploads, and trade documents (ICPO, PSA) per transaction."
    >
      <BuyerCisPdfDownload />
      <div className="mb-8 rounded-lg border border-[var(--line)] bg-white p-5 text-sm text-[var(--stone)]">
        <p className="font-semibold text-[var(--navy)]">ICPO and other trade PDFs</p>
        <p className="mt-2 leading-relaxed">
          Pre-filled ICPO drafts and generated trade documents are created inside each{" "}
          <strong>transaction workspace</strong> once your trade desk opens a programme — open a
          transaction, use <strong>Documents</strong>, and generate or upload signed copies. Editable
          PDF templates with buyer pre-fill are being extended; use CIS + LOI below until your desk
          sends the transaction pack.
        </p>
        <Link href="/portal/buyer/transactions" className="mt-3 inline-block font-semibold text-[var(--navy)] underline">
          View my transactions →
        </Link>
      </div>
      <BuyerLoiUploadPanel />
    </PortalPage>
  );
}
