import Link from "next/link";
import {
  TRADE_ALERT_DISCLAIMER,
  TRADE_INDEX_LINES,
} from "@/lib/content/trade-alert-indices";

export function TradeAlertStrip({ compact = false }: { compact?: boolean }) {
  const items = [...TRADE_INDEX_LINES, ...TRADE_INDEX_LINES];

  return (
    <section
      className="border-b border-[#d5d0c8] bg-[#f4f6f8]"
      aria-label="Trade reference alert"
    >
      <div className="container-page flex items-center gap-3 py-2 sm:gap-4">
        <div className="flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#001a3d] sm:text-sm">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#c88e4a]" aria-hidden />
          Trade alert
          {!compact ? (
            <Link href="/resources" className="normal-case tracking-normal text-[#c88e4a] hover:underline">
              Resources →
            </Link>
          ) : null}
        </div>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="trade-alert-marquee flex w-max gap-8 whitespace-nowrap text-sm text-[#333333]">
            {items.map((line, index) => (
              <span key={`${line.id}-${index}`} className="inline-flex items-center gap-2">
                <span className="font-semibold text-[#001a3d]">{line.label}</span>
                <span>{line.value}</span>
                <span
                  className={
                    line.direction === "up"
                      ? "text-[#1a6b3c]"
                      : line.direction === "down"
                        ? "text-[#9b2c2c]"
                        : "text-[#666666]"
                  }
                >
                  {line.change}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
      {!compact ? (
        <p className="container-page pb-2 text-xs leading-snug text-[#888888]">{TRADE_ALERT_DISCLAIMER}</p>
      ) : null}
    </section>
  );
}
