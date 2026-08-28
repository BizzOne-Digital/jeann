import { FOOD_SAFETY_MARKETS } from "@/lib/content/food-safety-agencies";

export function FoodSafetyAgencyMarquee() {
  const track = [...FOOD_SAFETY_MARKETS, ...FOOD_SAFETY_MARKETS];

  return (
    <section
      className="border-y border-[#d5d0c8] bg-[#f9f8f5] py-5"
      aria-label="Food safety standards in key trade markets"
    >
      <div className="container-page mb-4">
        <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-[#c88e4a] uppercase">
          Food safety & standards
        </p>
        <p className="mt-1 text-sm text-[#666666]">
          Countries we trade most — shipments aligned with destination food safety requirements
        </p>
      </div>

      <div className="food-safety-marquee overflow-hidden">
        <div className="food-safety-marquee-track flex w-max items-center gap-3 px-6 sm:gap-4">
          {track.map((market, index) => (
            <div
              key={`${market.id}-${index}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-[#d5d0c8] bg-white px-3.5 py-1.5 shadow-sm"
            >
              <span className="text-xs font-semibold text-[#001a3d]">{market.country}</span>
              <span className="hidden text-[0.65rem] text-[#888888] sm:inline" aria-hidden>
                ·
              </span>
              <span className="hidden text-[0.65rem] text-[#888888] sm:inline">{market.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
