"use client";

import { SiteHeader } from "@/components/marketing/SiteHeader";
import { MarketingMain } from "@/components/marketing/MarketingMain";
import type { ReactNode } from "react";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[70] w-full">
        <SiteHeader embedded />
      </div>
      <MarketingMain>{children}</MarketingMain>
    </>
  );
}
