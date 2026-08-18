import Link from "next/link";
import { requirePortalAccess } from "@/lib/auth/portal-access";
import { getBuyerFormDefaults } from "@/lib/auth/buyer-profile";
import { PortalPage } from "@/components/portal/PortalPage";
import { ContactForm } from "@/components/marketing/ContactForm";

export default async function BuyerContactPage() {
  const session = await requirePortalAccess("buyer");
  const prefill = await getBuyerFormDefaults(session);

  return (
    <PortalPage
      title="Contact trade desk"
      description="Send a message to Finekarts. For RFQs, use New purchase request."
    >
      <div className="max-w-3xl rounded-lg border border-[var(--line)] bg-white p-5 sm:p-8">
        <ContactForm prefill={prefill} />
      </div>
      <p className="mt-4 text-sm text-[var(--stone)]">
        <Link href="/portal/buyer/new-request" className="font-semibold text-[var(--navy)] underline">
          Submit a purchase request
        </Link>{" "}
        for product-specific enquiries.
      </p>
    </PortalPage>
  );
}
