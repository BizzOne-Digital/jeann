"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { isHeroMarketingPage } from "@/lib/marketing/hero-pages";
import type { ReactNode } from "react";

import { MARKETING_HEADER_HEIGHT, TRADE_ALERT_STRIP_HEIGHT } from "@/lib/marketing/hero-layout";

const HEADER_HEIGHT = MARKETING_HEADER_HEIGHT;

export function MarketingMain({
  children,
  showTradeTicker = false,
}: {
  children: ReactNode;
  showTradeTicker?: boolean;
}) {
  const pathname = usePathname();
  const isHeroPage = isHeroMarketingPage(pathname);
  const topOffset = showTradeTicker
    ? `calc(${HEADER_HEIGHT} + ${TRADE_ALERT_STRIP_HEIGHT})`
    : HEADER_HEIGHT;

  return (
    <main
      className={cn("min-w-0 w-full max-w-full flex-1 overflow-x-clip")}
      style={!isHeroPage ? { paddingTop: topOffset } : undefined}
    >
      {children}
    </main>
  );
}
