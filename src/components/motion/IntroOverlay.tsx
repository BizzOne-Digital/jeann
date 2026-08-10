"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";

const SESSION_KEY = "finekarts-intro-seen";

function subscribeIntro() {
  return () => {};
}

function getIntroSnapshot(): boolean {
  try {
    return !sessionStorage.getItem(SESSION_KEY);
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function IntroOverlay() {
  const reduce = useReducedMotion();
  const shouldOfferIntro = useSyncExternalStore(subscribeIntro, getIntroSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);
  const show = shouldOfferIntro && !dismissed;

  useEffect(() => {
    if (!show) return;
    const max = reduce ? 600 : 2400;
    const t = window.setTimeout(() => finish(), max);
    return () => window.clearTimeout(t);
    // finish is stable for this mount lifecycle
  }, [show, reduce]);

  function finish() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#13293d] text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.45 }}
          role="dialog"
          aria-label="Finekarts introduction"
        >
          <button
            type="button"
            onClick={finish}
            className="absolute right-5 top-5 text-sm text-white/70 underline-offset-4 hover:text-white hover:underline focus-ring"
          >
            Skip
          </button>
          <div className="flex flex-col items-center gap-6 px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/brand/finekarts-logo.png"
                alt="Finekarts"
                width={72}
                height={72}
                priority
                className="rounded-full"
              />
            </motion.div>
            <motion.p
              className="display text-2xl tracking-[0.2em] sm:text-3xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              FINEKARTS
            </motion.p>
            {!reduce ? (
              <svg
                width="220"
                height="40"
                viewBox="0 0 220 40"
                className="opacity-80"
                aria-hidden
              >
                <motion.path
                  d="M10 28 C 50 8, 90 8, 110 20 S 170 36, 210 12"
                  fill="none"
                  stroke="#C4A35A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0.2 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, ease: "easeInOut", delay: 0.25 }}
                />
              </svg>
            ) : null}
            <p className="max-w-xs text-sm text-white/65">
              Global agricultural commodity trading
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
