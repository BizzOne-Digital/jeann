"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";

const SESSION_KEY = "finekarts-intro-seen";
const INTRO_ACTIVE_CLASS = "intro-active";

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

function clearIntroBlock() {
  document.documentElement.classList.remove(INTRO_ACTIVE_CLASS);
}

export function IntroOverlay() {
  const reduce = useReducedMotion();
  const shouldOfferIntro = useSyncExternalStore(subscribeIntro, getIntroSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);
  const show = shouldOfferIntro && !dismissed;

  useEffect(() => {
    if (!show) {
      clearIntroBlock();
      return;
    }
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
    clearIntroBlock();
    setDismissed(true);
  }

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          id="finekarts-intro"
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
            <motion.p
              className="display text-3xl tracking-[0.22em] sm:text-4xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              FINEKARTS
            </motion.p>
            <motion.p
              className="text-[0.65rem] font-medium uppercase tracking-[0.42em] text-[#d4a84b]/90 sm:text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.45 }}
            >
              Incorporated
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
