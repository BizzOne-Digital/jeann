const LABELS: Record<string, string> = {
  email_verification: "verify your email",
  phone_verification: "verify your phone number",
  terms_acceptance: "accept the required terms",
  cis_kyb: "complete the CIS (Corporation Information Sheet)",
  cis_kyb_not_approved: "CIS approval by our team",
  admin_review: "admin review of your CIS",
  organization_not_approved: "admin approval of your organization",
};

/** Turns internal blocker keys into a short readable list (duplicates removed). */
export function describeBlockers(keys: string[]): string {
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const key of keys) {
    const label = LABELS[key] ?? key.replace(/_/g, " ");
    if (seen.has(label)) continue;
    seen.add(label);
    parts.push(label);
  }
  return parts.join("; ");
}
