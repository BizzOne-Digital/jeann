"use client";

import { IntroOverlay } from "@/components/motion/IntroOverlay";

/** Client-only mount so error/prerender shells do not break on motion hooks. */
export function IntroGate() {
  return <IntroOverlay />;
}
