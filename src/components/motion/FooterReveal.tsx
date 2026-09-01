"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

/** Scroll-reveal wrapper for server-rendered footer blocks. */
export function FooterReveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} y={20}>
      {children}
    </Reveal>
  );
}
