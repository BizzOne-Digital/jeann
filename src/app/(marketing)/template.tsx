"use client";

import { PageTransition } from "@/components/motion/PageTransition";

/** Re-mounts on navigation — pairs with layout shell for route enter motion. */
export default function MarketingTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
