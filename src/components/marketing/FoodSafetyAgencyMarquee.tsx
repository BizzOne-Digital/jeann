import { FOOD_SAFETY_MARKETS } from "@/lib/content/food-safety-agencies";
import { HOME_FOOD_SAFETY_STACK_HEIGHT } from "@/components/marketing/food-safety-stack-layout";

export function FoodSafetyAgencyMarquee() {
  const track = [...FOOD_SAFETY_MARKETS, ...FOOD_SAFETY_MARKETS];

  return (
    <section
      className={`flex flex-col justify-center border-y border-[#d5d0c8] bg-[#f9f8f5] py-8 sm:py-10 ${HOME_FOOD_SAFETY_STACK_HEIGHT}`}
      aria-label="Food safety standards in key trade markets"
    >
      <div className="container-page mb-5 sm:mb-6">
        <p className="text-sm font-bold tracking-[0.18em] text-[#a86f2e] uppercase sm:text-base">
          Food safety & standards
        </p>
        <p className="mt-2 text-base font-bold leading-snug text-[#333333] sm:text-lg">
          Countries we trade most — shipments aligned with destination food safety requirements
        </p>
      </div>

      <div className="food-safety-marquee overflow-hidden py-1">
        <div className="food-safety-marquee-track flex w-max items-center gap-3 px-6 sm:gap-4">
          {track.map((market, index) => (
            <div
              key={`${market.id}-${index}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-[#c5bfb5] bg-white px-4 py-2.5 shadow-sm"
            >
              <span className="text-sm font-bold text-[#001a3d] sm:text-base">{market.country}</span>
              <span className="text-sm font-bold text-[#555555] sm:inline" aria-hidden>
                ·
              </span>
              <span className="text-sm font-bold text-[#444444]">{market.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
