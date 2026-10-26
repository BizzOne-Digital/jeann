import { cmsField, cmsLines } from "@/lib/content/cms-field";
import { FOOD_SAFETY_MARKETS, type FoodSafetyMarket } from "@/lib/content/food-safety-agencies";
import { HOME_FOOD_SAFETY_STACK_HEIGHT } from "@/components/marketing/food-safety-stack-layout";

function MarketChip({ market }: { market: FoodSafetyMarket }) {
  return (
    <div
      className="flex shrink-0 items-center gap-2 rounded-full border border-[#c5bfb5] bg-white px-4 py-2.5 shadow-sm"
    >
      <span className="text-sm font-bold text-[#001a3d] sm:text-base">{market.country}</span>
      <span className="text-sm font-bold text-[#555555] sm:inline" aria-hidden>
        ·
      </span>
      <span className="text-sm font-bold text-[#444444]">{market.note}</span>
    </div>
  );
}

/** Optional CMS (home page): items are "Country: note" lines. */
export function FoodSafetyAgencyMarquee({ cms }: { cms?: Record<string, string> }) {
  const markets: FoodSafetyMarket[] = cmsLines(
    cms,
    "items",
    FOOD_SAFETY_MARKETS.map((m) => `${m.country}: ${m.note}`),
  ).map((line, i) => {
    const idx = line.indexOf(":");
    return idx === -1
      ? { id: `market-${i}`, country: line, note: "" }
      : { id: `market-${i}`, country: line.slice(0, idx).trim(), note: line.slice(idx + 1).trim() };
  });
  return (
    <section
      className={`flex flex-col justify-center border-y border-[var(--line)] bg-white py-8 sm:py-10 ${HOME_FOOD_SAFETY_STACK_HEIGHT}`}
      aria-label="Food safety standards in key trade markets"
    >
      <div className="container-page mb-5 sm:mb-6">
        <p className="text-sm font-bold tracking-[0.18em] text-[#a86f2e] uppercase sm:text-base">
          {cmsField(cms, "eyebrow", "Food safety & standards")}
        </p>
        <p className="mt-2 text-base font-bold leading-snug text-[#333333] sm:text-lg">
          {cmsField(
            cms,
            "title",
            "Countries we trade most — shipments aligned with destination food safety requirements",
          )}
        </p>
      </div>

      <div className="food-safety-marquee overflow-hidden py-1">
        <ul className="sr-only">
          {markets.map((market) => (
            <li key={market.id}>
              {market.country}: {market.note}
            </li>
          ))}
        </ul>
        <div className="food-safety-marquee-track flex w-max items-center gap-3 px-6 sm:gap-4">
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {markets.map((market) => (
              <MarketChip key={market.id} market={market} />
            ))}
          </div>
          <div
            className="food-safety-marquee-duplicate flex shrink-0 items-center gap-3 sm:gap-4"
            aria-hidden="true"
          >
            {markets.map((market) => (
              <MarketChip key={`dup-${market.id}`} market={market} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
