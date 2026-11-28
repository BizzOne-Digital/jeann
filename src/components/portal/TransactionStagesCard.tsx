import Link from "next/link";

export type StageSummary = {
  id: string;
  number: string;
  stage: 1 | 2;
  portal: string;
  role: string;
  statusLabel: string;
  stepsDone: number;
  stepsTotal: number;
  nextStep: { order: number; title: string } | null;
  isThis: boolean;
};

/**
 * Staff only. A trade has two stages: Finekarts sells in the buyer portal (stage 1) and buys in the supplier
 * portal (stage 2). The supplier order keeps the buyer order's number with a suffix. Buyers and suppliers never see
 * this card, because neither may see the other side.
 */
export function TransactionStagesCard({
  stage1,
  stage2,
  linkBase,
}: {
  stage1: StageSummary | null;
  stage2: StageSummary | null;
  linkBase: string;
}) {
  const cell = (s: StageSummary | null, stage: 1 | 2) => {
    const title = stage === 1 ? "Stage 1: buyer portal, Finekarts sells" : "Stage 2: supplier portal, Finekarts buys";
    if (!s) {
      return (
        <div className="rounded-md border border-dashed border-[var(--line)] p-4">
          <p className="text-xs text-[var(--stone)]">{title}</p>
          <p className="mt-1 text-sm text-[var(--stone)]">
            {stage === 2
              ? "The supplier order has not been opened yet. It will carry this order number, ending FS instead of FB."
              : "This supplier order is not linked to a buyer order."}
          </p>
        </div>
      );
    }
    return (
      <div className={"rounded-md border p-4 " + (s.isThis ? "border-[var(--navy)] bg-[var(--mist)]" : "border-[var(--line)]")}>
        <p className="text-xs text-[var(--stone)]">{title}</p>
        <p className="mt-1 font-semibold text-[var(--navy)]">{s.number}</p>
        <p className="text-sm text-[var(--stone)]">{s.statusLabel}</p>
        <p className="mt-1 text-xs text-[var(--stone)]">
          {s.stepsDone} of {s.stepsTotal} steps done
          {s.nextStep ? " · next: step " + s.nextStep.order : ""}
        </p>
        {s.isThis ? (
          <p className="mt-2 text-xs font-medium text-[var(--navy)]">You are viewing this stage</p>
        ) : (
          <Link href={linkBase + "/" + s.id} className="btn mt-2 inline-flex text-xs">
            Open this stage
          </Link>
        )}
      </div>
    );
  };
  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-5">
      <h2 className="font-semibold text-[var(--navy)]">The two stages of this transaction</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {cell(stage1, 1)}
        {cell(stage2, 2)}
      </div>
    </section>
  );
}
