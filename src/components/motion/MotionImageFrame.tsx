"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOutExpo, springSoft } from "@/components/motion/motionPresets";
import { cn } from "@/lib/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Image / media blocks — zoom-blur enter + subtle hover lift. */
export function MotionImageFrame({ children, className, delay = 0 }: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      initial={{ opacity: 0, scale: 1.07, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: easeOutExpo, delay }}
      whileHover={{ scale: 1.02, transition: springSoft }}
    >
      {children}
    </motion.div>
  );
}
