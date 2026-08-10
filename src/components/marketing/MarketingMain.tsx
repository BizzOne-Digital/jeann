"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { isHeroMarketingPage } from "@/lib/marketing/hero-pages";
import type { ReactNode } from "react";

export function MarketingMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHeroPage = isHeroMarketingPage(pathname);

  return (
    <main
      className={cn(
        "min-w-0 w-full max-w-full flex-1 overflow-x-clip",
        !isHeroPage && "pt-[4.75rem]",
      )}
    >
      {children}
    </main>
  );
}
