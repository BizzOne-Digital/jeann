const steps = ["Request", "Qualification", "Offer", "Contract", "Documents", "Settlement"];
export function TransactionStepper({ current = 1 }: { current?: number }) {
  return <ol className="grid gap-3 sm:grid-cols-6">{steps.map((step, index) => <li key={step} className={`rounded-md border p-3 text-center text-xs font-semibold ${index < current ? "border-[var(--forest)] bg-[var(--forest)] text-white" : "border-[var(--line)] bg-white text-[var(--stone)]"}`}><span className="mr-1 opacity-70">{index + 1}.</span>{step}</li>)}</ol>;
}
