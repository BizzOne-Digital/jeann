import Link from "next/link";
import {
  TRADE_ALERT_DISCLAIMER,
  TRADE_INDEX_LINES,
} from "@/lib/content/trade-alert-indices";

export function TradeAlertStrip() {
  const items = [...TRADE_INDEX_LINES, ...TRADE_INDEX_LINES];

  return (
    <section
      className="border-b border-[#d5d0c8] bg-[#f8f6f1]"
      aria-label="Trade reference alert"
    >
      <div className="container-page flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#001a3d]">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#c88e4a]" aria-hidden />
          Trade alert
          <Link href="/resources" className="normal-case tracking-normal text-[#c88e4a] hover:underline">
            Resources →
          </Link>
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
      <p className="container-page pb-2 text-[0.65rem] leading-snug text-[#888888]">
        {TRADE_ALERT_DISCLAIMER}
      </p>
    </section>
  );
}
