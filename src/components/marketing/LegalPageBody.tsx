"use client";

import type { ReactNode } from "react";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { StaggerReveal } from "@/components/motion/StaggerReveal";

/** Animated wrapper for legal / policy page content below the hero. */
export function LegalPageBody({
  banner,
  children,
  footer,
}: {
  banner?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <>
      {banner ? <AnimatedSection y={16}>{banner}</AnimatedSection> : null}
      <StaggerReveal className="prose-trade mt-8 space-y-4 text-sm" stagger={0.07}>
        {children}
      </StaggerReveal>
      {footer ? (
        <AnimatedSection className="mt-10" delay={0.12} y={20}>
          {footer}
        </AnimatedSection>
      ) : null}
    </>
  );
}
