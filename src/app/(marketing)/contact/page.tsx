import type { Metadata } from "next";
import {
  ContactHero,
  ContactChannels,
  ContactFormSection,
  ContactCta,
} from "@/components/marketing/ContactSections";
import { getSite } from "@/lib/content/catalog";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the Finekarts trade desk. Buyer messages and consultations are submitted through the buyer portal after sign-in.",
};

export default function ContactPage() {
  const site = getSite();

  return (
    <>
      <ContactHero />
      <ContactChannels
        email={site.email}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay}
      />
      <ContactFormSection
        email={site.email}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay}
        addressLine1={site.addressLine1}
        addressLine2={site.addressLine2}
      />
      <ContactCta />
    </>
  );
}
