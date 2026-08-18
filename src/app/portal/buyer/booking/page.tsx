import Link from "next/link";
import { requirePortalAccess } from "@/lib/auth/portal-access";
import { getBuyerFormDefaults } from "@/lib/auth/buyer-profile";
import { PortalPage } from "@/components/portal/PortalPage";
import { BookingForm } from "@/components/marketing/BookingForm";

export default async function BuyerBookingPage() {
  const session = await requirePortalAccess("buyer");
  const prefill = await getBuyerFormDefaults(session);

  return (
    <PortalPage
      title="Book a consultation"
      description="Request a trade desk consultation. Requests are reviewed — not confirmed appointments until staff confirms."
    >
      <div className="max-w-3xl rounded-lg border border-[var(--line)] bg-white p-5 sm:p-8">
        <BookingForm prefill={prefill} />
      </div>
      <p className="mt-4 text-sm text-[var(--stone)]">
        Prefer email?{" "}
        <Link href="/portal/buyer/messages" className="font-semibold text-[var(--navy)] underline">
          Messages
        </Link>{" "}
        or Info@finekarts.com
      </p>
    </PortalPage>
  );
}
