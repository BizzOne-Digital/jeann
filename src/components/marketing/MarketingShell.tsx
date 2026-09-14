"use client";

import { SiteHeader } from "@/components/marketing/SiteHeader";
import { MarketingMain } from "@/components/marketing/MarketingMain";
import { AmbientPageMotion } from "@/components/motion/AmbientPageMotion";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import type { ReactNode } from "react";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <AmbientPageMotion />
      <ScrollProgress />
      <div className="fixed inset-x-0 top-0 z-[70] w-full">
        <SiteHeader embedded />
      </div>
      <MarketingMain>{children}</MarketingMain>
    </>
  );
}
