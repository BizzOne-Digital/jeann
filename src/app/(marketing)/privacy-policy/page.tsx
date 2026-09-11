import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { PRIVACY_POLICY_DOCUMENT } from "@/lib/content/legal/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Finekarts privacy policy — how we collect, use, and protect personal information.",
};

export default function PrivacyPolicyPage() {
  return <LegalDocumentPage document={PRIVACY_POLICY_DOCUMENT} kind="privacy" />;
}
