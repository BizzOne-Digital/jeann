import { BUYER_WORKFLOW_STEPS } from "@/lib/workflows/transitions";

/**
 * The trade procedure of the SCO or FCO. It is the workflow itself: the same eight steps, in the same words, as
 * stage 1 of the transaction (buyer portal), so the buyer reads every step of the transaction before accepting the
 * offer. It is generated from the workflow, so the two can never drift apart.
 */
export function tradeProcedureLines(): string[] {
  return BUYER_WORKFLOW_STEPS.map((s) => s.order + ". " + s.title + ".");
}
