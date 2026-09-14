"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOutBack, easeOutExpo, springBouncy } from "@/components/motion/motionPresets";
import { cn } from "@/lib/utils/cn";

export type RevealVariant =
  | "up"
  | "down"
  | "left"
  | "right"
  | "zoom"
  | "blur-up"
  | "tilt";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  variant?: RevealVariant;
  /** Spring pop instead of eased slide */
  bounce?: boolean;
};

function variantInitial(
  variant: RevealVariant,
  y: number,
): { opacity: number; x?: number; y?: number; scale?: number; rotate?: number; filter?: string } {
  switch (variant) {
    case "down":
      return { opacity: 0, y: -y };
    case "left":
      return { opacity: 0, x: -y };
    case "right":
      return { opacity: 0, x: y };
    case "zoom":
      return { opacity: 0, scale: 0.88, y: y * 0.35 };
    case "blur-up":
      return { opacity: 0, y, filter: "blur(12px)" };
    case "tilt":
      return { opacity: 0, y, rotate: -2.5, scale: 0.96 };
    case "up":
    default:
      return { opacity: 0, y };
  }
}

function variantAnimate(variant: RevealVariant) {
  const base = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" };
  return base;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  variant = "up",
  bounce = false,
}: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={variantInitial(variant, y)}
      whileInView={variantAnimate(variant)}
      viewport={{ once, margin: "-10% 0px", amount: 0.18 }}
      transition={
        bounce
          ? { ...springBouncy, delay }
          : { duration: 0.75, ease: variant === "zoom" ? easeOutBack : easeOutExpo, delay }
      }
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
              initial={{ y: "110%", opacity: 0, rotate: 4 }}
              {...(immediate
                ? {
                    animate: { y: "0%", opacity: 1, rotate: 0 },
                  }
                : {
                    whileInView: { y: "0%", opacity: 1, rotate: 0 },
                    viewport: { once: true, amount: 0.4 },
                  })}
              transition={{
                duration: 0.8,
                delay: 0.06 + i * 0.055,
                ease: easeOutExpo,
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
