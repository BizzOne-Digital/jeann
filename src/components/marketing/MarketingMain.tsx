"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { isHeroMarketingPage } from "@/lib/marketing/hero-pages";
import type { ReactNode } from "react";

const HEADER_HEIGHT = "4.75rem";
const TICKER_HEIGHT = "2.75rem";

export function MarketingMain({
  children,
  showTicker = false,
}: {
  children: ReactNode;
  showTicker?: boolean;
}) {
  const pathname = usePathname();
  const isHeroPage = isHeroMarketingPage(pathname);
  const topOffset = showTicker
    ? `calc(${HEADER_HEIGHT} + ${TICKER_HEIGHT})`
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
