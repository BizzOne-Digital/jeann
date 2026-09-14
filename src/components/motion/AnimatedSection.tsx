"use client";

import type { ReactNode } from "react";
import { Reveal, type RevealVariant } from "@/components/motion/Reveal";

/** Standard scroll-reveal wrapper for marketing page sections. */
export function AnimatedSection({
  children,
  className,
  delay = 0,
  y = 32,
  variant = "blur-up",
  bounce = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  variant?: RevealVariant;
  bounce?: boolean;
}) {
  return (
    <Reveal delay={delay} y={y} variant={variant} bounce={bounce} className={className}>
      {children}
    </Reveal>
  );
}
