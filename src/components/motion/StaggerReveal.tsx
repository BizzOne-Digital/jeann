"use client";

import { Children, type ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  children: ReactNode;
  className?: string;
  /** Delay between each child reveal (seconds). */
  stagger?: number;
  y?: number;
};

/** Reveals each direct child with a staggered scroll animation. */
export function StaggerReveal({ children, className, stagger = 0.06, y = 20 }: Props) {
  const items = Children.toArray(children).filter(Boolean);

  return (
    <div className={className}>
      {items.map((child, index) => (
        <Reveal key={index} delay={index * stagger} y={y}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
