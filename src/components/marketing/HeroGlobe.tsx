"use client";

import { motion, useReducedMotion } from "framer-motion";

export function HeroGlobe() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden>
      <div className="absolute inset-[8%] rounded-full border border-ocean/20 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.9),rgba(232,238,242,0.85)_45%,rgba(58,107,140,0.12))] shadow-[var(--shadow-soft)]" />
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <circle cx="200" cy="200" r="148" fill="none" stroke="rgba(27,58,92,0.12)" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="148" ry="55" fill="none" stroke="rgba(58,107,140,0.18)" />
        <ellipse cx="200" cy="200" rx="55" ry="148" fill="none" stroke="rgba(58,107,140,0.18)" />
        <path
          d="M60 210 C 120 140, 180 130, 230 170 S 320 250, 350 190"
          fill="none"
          stroke="#C4A35A"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray={reduce ? undefined : "6 8"}
        >
          {!reduce ? (
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-56"
              dur="4s"
              repeatCount="indefinite"
            />
          ) : null}
        </path>
        <path
          d="M70 250 C 140 280, 210 260, 270 210 S 330 120, 345 150"
          fill="none"
          stroke="#3A6B8C"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.7"
        />
        {!reduce
          ? [
              { cx: 120, cy: 168, delay: 0 },
              { cx: 230, cy: 170, delay: 0.4 },
              { cx: 300, cy: 220, delay: 0.8 },
            ].map((p) => (
              <motion.circle
                key={`${p.cx}-${p.cy}`}
                cx={p.cx}
                cy={p.cy}
                r="4"
                fill="#1B3A5C"
                initial={{ opacity: 0.35, scale: 0.8 }}
                animate={{ opacity: [0.35, 1, 0.35], scale: [0.8, 1.15, 0.8] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: p.delay }}
              />
            ))
          : null}
      </svg>
      <motion.div
        className="absolute bottom-[18%] left-[12%] rounded-full border border-[var(--line)] bg-white/90 px-3 py-1 text-[0.7rem] font-medium text-navy shadow-sm"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Origin markets
      </motion.div>
      <motion.div
        className="absolute right-[10%] top-[22%] rounded-full border border-[var(--line)] bg-white/90 px-3 py-1 text-[0.7rem] font-medium text-navy shadow-sm"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        Destination ports
      </motion.div>
    </div>
  );
}
