"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { TradeAlertStrip } from "@/components/marketing/TradeAlertStrip";
import { MarketingMain } from "@/components/marketing/MarketingMain";
import type { ReactNode } from "react";

export function MarketingShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showTradeTicker = pathname === "/";

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[70] w-full">
        <SiteHeader embedded />
        {showTradeTicker ? <TradeAlertStrip compact /> : null}
      </div>
      <MarketingMain showTradeTicker={showTradeTicker}>{children}</MarketingMain>
    </>
  );
}
