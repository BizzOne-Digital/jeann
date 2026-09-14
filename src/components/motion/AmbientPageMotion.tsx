"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Soft floating accents behind page content — all marketing routes. */
export function AmbientPageMotion() {
  const reduce = useReducedMotion();

  if (reduce) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute -left-[12%] top-[8%] h-[min(520px,70vw)] w-[min(520px,70vw)] rounded-full bg-[radial-gradient(circle,rgba(232,154,45,0.14)_0%,transparent_68%)]"
        animate={{
          x: [0, 28, -12, 0],
          y: [0, -18, 10, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[8%] top-[32%] h-[min(440px,55vw)] w-[min(440px,55vw)] rounded-full bg-[radial-gradient(circle,rgba(58,107,140,0.12)_0%,transparent_70%)]"
        animate={{
          x: [0, -24, 16, 0],
          y: [0, 22, -8, 0],
          scale: [1, 0.94, 1.06, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
      <motion.div
        className="absolute bottom-[12%] left-[35%] h-[min(360px,45vw)] w-[min(360px,45vw)] rounded-full bg-[radial-gradient(circle,rgba(196,163,90,0.1)_0%,transparent_72%)]"
        animate={{
          x: [0, 18, -20, 0],
          y: [0, -12, 14, 0],
          opacity: [0.5, 0.85, 0.55, 0.5],
        }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
    </div>
  );
}
