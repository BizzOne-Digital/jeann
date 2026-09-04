import type { Metadata } from "next";
import {
  ContactHero,
  ContactChannels,
  ContactFormSection,
  ContactCta,
} from "@/components/marketing/ContactSections";
import { getSite } from "@/lib/content/catalog";
import { getPublishedPage, getSectionFields } from "@/lib/content/page-content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the Finekarts trade desk by email, phone, or the contact form.",
};

export default async function ContactPage() {
  const site = getSite();
  const cms = await getPublishedPage("contact");

  return (
    <>
      <ContactHero cms={getSectionFields(cms, "hero")} />
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
