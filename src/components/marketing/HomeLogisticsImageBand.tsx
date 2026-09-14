import Image from "next/image";
import { LOGISTICS_IMAGES } from "@/lib/content/logistics-images";
import { HOME_FOOD_SAFETY_STACK_HEIGHT } from "@/components/marketing/food-safety-stack-layout";

/** Home only — visual band matching food-safety stack height (logistics hero imagery). */
export function HomeLogisticsImageBand() {
  const image = LOGISTICS_IMAGES.hero;

  return (
    <section
      className={`relative w-full overflow-hidden border-y border-[#d5d0c8] ${HOME_FOOD_SAFETY_STACK_HEIGHT}`}
      aria-label="Global shipping and logistics"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071525]/35 via-transparent to-[#071525]/20" />
    </section>
  );
}
