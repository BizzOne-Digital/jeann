/**
 * Terms that must be written in the PSA itself. A deadline or rule shown only on the portal is not
 * part of the contract, so these clauses are added to every generated PSA, and the portal text
 * reads the same values from here.
 */

/** Hours the buyer has to submit the LC after the Proforma Invoice is issued. */
export const LC_DEADLINE_HOURS = 24;

export type PsaMandatoryClause = { marker: string; text: (hours: number) => string };

/** Staff may set any deadline from 1 to 720 hours on a PSA. */
export function normalizeLcDeadlineHours(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 && n <= 720 ? Math.round(n) : LC_DEADLINE_HOURS;
}

export const PSA_MANDATORY_CLAUSES: PsaMandatoryClause[] = [
  {
    marker: "Letter of Credit deadline:",
    text: (hours) =>
      "Letter of Credit deadline: the buyer shall submit the Letter of Credit from its issuing bank, of the type and for the exact amount agreed in this PSA, within " +
      hours +
      " hours of the Proforma Invoice being issued. The Letter of Credit must match this PSA in every respect.",
  },
  {
    marker: "Amendments:",
    text: () =>
      "Amendments: if the buyer requests an amendment, or submits a Letter of Credit that does not match this PSA, an amendment fee set by the bank applies and is added to the total cost of the amended PSA. If the Letter of Credit matches this PSA, no amendment fee is due.",
  },
  {
    marker: "Execution:",
    text: () =>
      "Execution: this PSA is a binding contract once it has been signed and stamped by both parties, with a copy of the passport of the signing director, owner, manager or president attached.",
  },
];

/** The mandatory clauses that are not already present in the given text lines. */
export function missingPsaClauses(existing: string[], hours: number = LC_DEADLINE_HOURS): string[] {
  const haystack = existing.join("\n");
  return PSA_MANDATORY_CLAUSES.filter((c) => !haystack.includes(c.marker)).map((c) => c.text(hours));
}
