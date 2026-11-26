import Link from "next/link";
import { BuyerLoiUploadPanel } from "@/components/portal/BuyerLoiUploadPanel";
import { PortalPage } from "@/components/portal/PortalPage";

export default function DocumentsPage() {
  return (
    <PortalPage
      title="Documents"
      description="Upload your LOI here. Other transaction documents are handled inside each transaction's Documents tab."
    >
      <p className="mb-4 rounded-md border border-[var(--line)] bg-[var(--mist)] px-4 py-3 text-sm text-[var(--navy)]">
        Each transaction has its own Documents tab. Open the transaction under{" "}
        <Link href="/portal/buyer/transactions" className="font-semibold underline">Transactions</Link>{" "}
        to see and upload its documents.
      </p>
      <div className="mb-8 rounded-lg border border-[var(--line)] bg-white p-5 text-sm text-[var(--stone)]">
        <p className="font-semibold text-[var(--navy)]">How documents are requested</p>
        <p className="mt-2 leading-relaxed">
          After your ICPO or LOI has been reviewed, Finekarts will request any further documents
          it needs, such as the <strong>CIS</strong>, <strong>RWA</strong> and <strong>FIS</strong>{" "}
          for Letter of Credit (LC) transactions. The RWA is required on every LC transaction. The
          CIS and FIS are needed once for the same bank. When requested, upload them in the{" "}
          <strong>Documents</strong> tab of the relevant transaction. ICPO drafts and other trade
          PDFs are also handled there.
        </p>
        <Link href="/portal/buyer/transactions" className="mt-3 inline-block font-semibold text-[var(--navy)] underline">
          View my transactions →
        </Link>
      </div>
      <BuyerLoiUploadPanel />
    </PortalPage>
  );
}
