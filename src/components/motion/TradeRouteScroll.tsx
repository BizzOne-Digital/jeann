"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * High-value cinematic sequence using GSAP ScrollTrigger.
 * Gracefully no-ops when reduced motion is preferred or GSAP fails to load.
 */
export function TradeRouteScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current || !pathRef.current) return;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const path = pathRef.current!;
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      ctx = gsap.context(() => {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            end: "bottom 40%",
            scrub: 0.6,
          },
        });
        gsap.fromTo(
          ".route-label",
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 60%",
              end: "center center",
              scrub: 0.4,
            },
          },
        );
      }, ref);
    })().catch(() => {
      /* GSAP optional */
    });

    return () => ctx?.revert();
  }, [reduce]);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-paper p-6 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">Trade corridors</p>
      <h3 className="display mt-2 text-2xl text-ink sm:text-3xl">From origin markets to destination ports</h3>
      <svg viewBox="0 0 640 220" className="mt-8 h-auto w-full" aria-hidden>
        <path
          ref={pathRef}
          d="M40 160 C 140 40, 220 40, 300 110 S 460 200, 600 70"
          fill="none"
          stroke="#C4A35A"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="40" cy="160" r="5" fill="#1B3A5C" />
        <circle cx="600" cy="70" r="5" fill="#1B3A5C" />
      </svg>
      <div className="mt-4 flex flex-wrap gap-6 text-sm text-stone">
        <span className="route-label">Origin programmes</span>
        <span className="route-label">Documentation & inspection</span>
        <span className="route-label">Destination delivery terms</span>
      </div>
    </div>
  );
}
