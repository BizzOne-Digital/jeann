"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
}: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px", amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function MaskedHeadline({
  text,
  as: Tag = "h1",
  className,
  /** Use mount animation (safer for above-the-fold hero). */
  immediate = false,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={cn("overflow-hidden", className)} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="flex flex-wrap gap-x-[0.35em]">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-1">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "110%", opacity: 0 }}
              {...(immediate
                ? {
                    animate: { y: "0%", opacity: 1 },
                  }
                : {
                    whileInView: { y: "0%", opacity: 1 },
                    viewport: { once: true, amount: 0.4 },
                  })}
              transition={{
                duration: 0.75,
                delay: 0.08 + i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
