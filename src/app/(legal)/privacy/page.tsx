import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { PRIVACY_POLICY_DOCUMENT } from "@/lib/content/legal/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Finekarts Inc. privacy policy for website, portals, and business communications.",
};

export default function PrivacyPolicyPage() {
  return <LegalDocumentPage document={PRIVACY_POLICY_DOCUMENT} />;
}
