"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <Reveal key={item.question} delay={i * 0.05} y={16}>
            <div>
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
              {reduce ? (
                <div className={cn("overflow-hidden", open ? "pb-5" : "hidden")}>
                  <p className="max-w-3xl text-sm leading-relaxed text-stone">{item.answer}</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-3xl pb-5 text-sm leading-relaxed text-stone">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
