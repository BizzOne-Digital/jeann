/** Pure RWA (Ready, Willing and Able) rules. No database access; safe to import from client components. */

export const RWA_REQUIRED_MESSAGE =
  "RWA (Ready, Willing and Able) letter from your bank is required for LC payment terms";

export const RWA_DESCRIPTION =
  "RWA (Ready, Willing and Able) letter: issued by your bank to confirm your readiness to complete the transaction, including your account balance.";

const LC_INSTRUMENT_KEYS = ["irrevocable_documentary_lc", "standby_lc"];

/**
 * True when the instrument type key or free-text payment term refers to a Letter of Credit
 * (LC at sight, irrevocable, transferable, revolving, confirmed, standby/SBLC).
 * False for bank guarantee, documentary collection, TT and anything else.
 */
export function isRwaRequired(paymentTermOrInstrument: string | null | undefined): boolean {
  const raw = String(paymentTermOrInstrument ?? "").trim().toLowerCase();
  if (!raw) return false;
  if (LC_INSTRUMENT_KEYS.includes(raw)) return true;
  const text = raw.replace(/[_-]+/g, " ");
  if (/\bletters? of credit\b/.test(text)) return true;
  return /\b(lc|lcs|sblc|dlc|mt700)\b/.test(text);
}

/** Any of several inputs (instrument type, payment proposal, banking proposal) requires RWA. */
export function isRwaRequiredFor(...values: Array<string | null | undefined>): boolean {
  return values.some((v) => isRwaRequired(v));
}

const NON_QUALIFYING_STATUSES = ["changes_requested", "superseded", "archived"];

/** An RWA counts once uploaded by the buyer organization and not rejected/withdrawn/deleted. */
export function hasQualifyingRwa(
  docs: Array<{ documentType?: string; workflowStatus?: string; deletedAt?: unknown }>,
): boolean {
  return docs.some(
    (d) =>
      d.documentType === "rwa" &&
      !d.deletedAt &&
      !NON_QUALIFYING_STATUSES.includes(String(d.workflowStatus)),
  );
}
