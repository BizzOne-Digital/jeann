import { PortalPage } from "@/components/portal/PortalPage";
import { TransactionStepper } from "@/components/portal/TransactionStepper";
export default function SupplierPage() { return <PortalPage title="Supplier workspace" description="This invite-only workspace supports counterparty messaging and the supplier side of approved transactions."><TransactionStepper current={0} /><p className="mt-5 rounded-md bg-[var(--mist)] p-4 text-sm text-[var(--stone)]">No active invitation or transaction is available. Supplier offers are reviewed before access is granted.</p></PortalPage>; }
