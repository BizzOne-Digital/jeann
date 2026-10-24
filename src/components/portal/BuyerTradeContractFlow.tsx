import {
  BUYER_PSA_DEFINITION,
  BUYER_PI_TRANSFER_TRANSACTION_NOTE,
  BUYER_TRADE_DOCUMENT_FLOW,
} from "@/lib/content/buyer-portal-guidance";

export function BuyerTradeContractFlow({ compact }: { compact?: boolean }) {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-4 text-sm text-[var(--stone)]">
      <h3 className="font-semibold text-[var(--navy)]">Trade documents (order of steps)</h3>
      {!compact ? (
        <p className="mt-2 leading-relaxed">{BUYER_PSA_DEFINITION}</p>
      ) : null}
      <ol className="mt-3 space-y-3">
        {BUYER_TRADE_DOCUMENT_FLOW.map((item) => (
          <li key={item.step}>
            <span className="font-medium text-[var(--navy)]">
              {item.step}. {item.title}
            </span>
            <p className="mt-0.5 leading-relaxed">{item.body}</p>
          </li>
        ))}
      </ol>
      {!compact ? (
        <p className="mt-3 text-xs leading-relaxed">{BUYER_PI_TRANSFER_TRANSACTION_NOTE}</p>
      ) : null}
    </section>
  );
}
