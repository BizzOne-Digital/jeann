import {
  BUYER_ICPO_REQUIRED_FIELDS,
  BUYER_PAYMENT_ALIGNMENT_HINTS,
  BUYER_ICPO_LEGAL_WARNING,
} from "@/lib/content/buyer-portal-guidance";
import { BuyerTradeContractFlow } from "@/components/portal/BuyerTradeContractFlow";

export function BuyerIcpoGuidancePanel() {
  return (
    <aside className="space-y-4 text-sm text-[var(--stone)]">
      <BuyerTradeContractFlow />
      <section className="rounded-lg border border-[var(--line)] bg-[var(--cream)] p-4">
        <h3 className="font-semibold text-[var(--navy)]">What must be on your ICPO</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {BUYER_ICPO_REQUIRED_FIELDS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="rounded-lg border border-[var(--line)] bg-white p-4">
        <h3 className="font-semibold text-[var(--navy)]">Match our payment terms</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {BUYER_PAYMENT_ALIGNMENT_HINTS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="rounded-lg border border-[var(--line)] bg-white p-4">
        <h3 className="font-semibold text-[var(--navy)]">Legal notice</h3>
        <p className="mt-2 leading-relaxed">{BUYER_ICPO_LEGAL_WARNING}</p>
      </section>
    </aside>
  );
}
