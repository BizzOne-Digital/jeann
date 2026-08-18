"use client";

import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { getCategories, SEED_FAQS } from "@/lib/content/catalog";
import { buyerQuoteHref } from "@/lib/marketing/cta-links";

type Msg = { role: "user" | "assistant"; text: string };

function answerFor(input: string): string {
  const q = input.toLowerCase();
  const categories = getCategories();

  if (/(price|pricing|cost|quote)/.test(q)) {
    return "Finekarts does not publish fixed prices. Submit a purchase request with quantity, specs, destination, and preferred Incoterm (FOB/CIF) so the trade desk can review. This is general information — not a binding quote.";
  }
  if (/(fob|cif|incoterm)/.test(q)) {
    return "FOB and CIF are commonly discussed. FOB typically focuses on delivery on board at origin; CIF typically bundles freight and minimum insurance to a destination port. Final allocations follow the signed contract. See /resources and /shipping for more.";
  }
  if (/(packag|flexitank|fibc|drum|tank)/.test(q)) {
    return "Packaging depends on product, supplier, route, and agreement. Dry bulk may use FIBCs, liners, or sacks; liquids may use flexitanks, IBCs, drums, or ISO tanks. Not every option applies to every product — see /packaging.";
  }
  if (/(supplier|become a supplier|sell to)/.test(q)) {
    return "Suppliers cannot self-register publicly. Finekarts sends single-use invitation links after review. Contact the trade desk to start a supplier conversation.";
  }
  if (/(book|consultation|meeting|call)/.test(q)) {
    return "You can request a consultation from the buyer portal after sign-in at /portal/buyer/booking. Requests are stored for review and are not confirmed appointments until staff confirms.";
  }
  if (/(rfq|purchase request|buy)/.test(q)) {
    return "Sign in and submit a purchase request from the buyer portal. Include company details, product lines, quantities, destination, Incoterm preference, and packaging/inspection notes. Submission does not guarantee acceptance or supply.";
  }

  const productHit = categories
    .flatMap((c) => c.products.map((p) => ({ ...p, category: c.name, categorySlug: c.slug })))
    .find((p) => q.includes(p.name.toLowerCase()) || q.includes(p.slug.replace(/-/g, " ")));

  if (productHit) {
    return `${productHit.name} is listed under ${productHit.category}. ${productHit.overview} Status: ${productHit.status.replaceAll("_", " ")}. Request a quote from /products/${productHit.categorySlug}/${productHit.slug} (buyer sign-in required). General information only — not a binding offer.`;
  }

  const faq = SEED_FAQS.find(
    (f) =>
      q.split(" ").some((w) => w.length > 3 && f.question.toLowerCase().includes(w)) ||
      f.answer.toLowerCase().includes(q.slice(0, 24)),
  );
  if (faq) return `${faq.answer} (From published FAQ — not legal advice.)`;

  return "I can help with published products, packaging, FOB/CIF basics, booking, and how to submit a purchase request. For a specific opportunity, please use the contact or RFQ form so the trade desk can review. Answers are general information, not a contract, bank instruction, or guarantee.";
}

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [consent, setConsent] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
        text: "Ask about published products, packaging, trade process, or booking. Live AI uses Groq when configured; otherwise answers come from approved public content.",
    },
  ]);
  const reduce = useReducedMotion();
  const suggestions = useMemo(
    () => ["FOB vs CIF", "Canola oil", "How to request a quote", "Packaging options"],
    [],
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, consentToContact: consent }),
      });
      if (res.ok) {
        const data = (await res.json()) as { reply: string };
        setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
        return;
      }
    } catch {
      /* fallback local */
    }
    setMessages((m) => [...m, { role: "assistant", text: answerFor(text) }]);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring fixed bottom-4 right-4 z-40 max-w-[calc(100%-2rem)] rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] sm:bottom-5 sm:right-5 sm:px-5 sm:py-3"
      >
        Ask Finekarts
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-end bg-ink/30 p-4 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-label="Finekarts product assistant"
              className="flex h-[min(640px,90vh)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-paper shadow-[var(--shadow-soft)]"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] bg-navy px-4 py-3 text-white">
                <div>
                  <p className="font-semibold">Trade assistant</p>
                  <p className="text-xs text-white/65">Public information only</p>
                </div>
                <button type="button" className="focus-ring text-sm underline" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.map((m, i) => (
                  <div
                    key={`${m.role}-${i}`}
                    className={
                      m.role === "user"
                        ? "ml-4 break-words rounded-2xl bg-mist px-3 py-2 text-sm text-ink sm:ml-8"
                        : "mr-4 break-words rounded-2xl bg-cream px-3 py-2 text-sm text-stone sm:mr-6"
                    }
                  >
                    {m.text}
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="rounded-full border border-[var(--line-strong)] px-3 py-1 text-xs text-navy"
                      onClick={() => setInput(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-stone">
                  Prefer a person?{" "}
                  <Link href={buyerQuoteHref()} className="font-semibold text-navy underline">
                    Submit an RFQ
                  </Link>{" "}
                  or{" "}
                  <Link href="/contact" className="font-semibold text-navy underline">
                    contact us
                  </Link>
                  .
                </p>
              </div>

              <form onSubmit={onSubmit} className="border-t border-[var(--line)] p-4">
                <label className="mb-3 flex items-start gap-2 text-xs text-stone">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5"
                  />
                  I consent to Finekarts contacting me about this conversation if I share contact details.
                </label>
                <div className="flex gap-2">
                  <input
                    className="field"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about products or process…"
                    aria-label="Assistant message"
                  />
                  <button type="submit" className="btn btn-primary !px-4">
                    Send
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
