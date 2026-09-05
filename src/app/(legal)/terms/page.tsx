import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { TERMS_AND_CONDITIONS_DOCUMENT } from "@/lib/content/legal/terms-and-conditions";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Finekarts Inc. website terms and conditions.",
};

export default function TermsAndConditionsPage() {
  return <LegalDocumentPage document={TERMS_AND_CONDITIONS_DOCUMENT} />;
}
