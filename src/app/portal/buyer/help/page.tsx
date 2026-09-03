import Link from "next/link";
import { PortalPage } from "@/components/portal/PortalPage";

const LINKS = [
  { href: "/faq", label: "FAQ — trade process and Incoterms" },
  { href: "/resources", label: "Resources — documents and banking terms" },
  { href: "/portal/buyer/new-request", label: "Submit a purchase request" },
  { href: "/contact", label: "Contact the trade desk" },
  { href: "/portal/buyer/onboarding", label: "Onboarding checklist" },
];

export default function BuyerHelpPage() {
  return (
    <PortalPage
      title="Help"
      description="Quick links for buyers using the Finekarts portal."
    >
      <ul className="max-w-xl space-y-3">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-base font-semibold text-[var(--navy)] underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 max-w-xl text-sm text-[var(--stone)]">
        For transaction-specific questions, use{" "}
        <Link href="/portal/buyer/messages" className="font-semibold text-[var(--navy)] underline">
          Messages
        </Link>{" "}
        so your trade desk can respond in context.
      </p>
    </PortalPage>
  );
}
