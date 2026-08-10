"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              className="focus-ring flex w-full items-start justify-between gap-4 py-5 text-left"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <span className="display text-xl text-ink">{item.question}</span>
              <span className="mt-1 shrink-0 text-ocean" aria-hidden>
                {open ? "−" : "+"}
              </span>
            </button>
            <div className={cn("overflow-hidden transition-all", open ? "pb-5" : "max-h-0")}>
              <p className="max-w-3xl text-sm leading-relaxed text-stone">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
