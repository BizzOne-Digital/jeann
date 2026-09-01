"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

/** Standard scroll-reveal wrapper for marketing page sections. */
export function AnimatedSection({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <Reveal delay={delay} y={y} className={className}>
      {children}
    </Reveal>
  );
}
