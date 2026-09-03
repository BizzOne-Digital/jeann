import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export const BRAND_LOGO_SRC = "/brand/finekarts-logo.png";

const SIZES = {
  sm: { box: "h-11 w-11 sm:h-12 sm:w-12", px: 48 },
  md: { box: "h-14 w-14 sm:h-16 sm:w-16", px: 64 },
  lg: { box: "h-20 w-20 sm:h-24 sm:w-24", px: 96 },
  xl: { box: "h-28 w-28 sm:h-32 sm:w-32", px: 128 },
} as const;

type BrandLogoSize = keyof typeof SIZES;

type Props = {
  size?: BrandLogoSize;
  className?: string;
  priority?: boolean;
  alt?: string;
};

export function BrandLogo({
  size = "sm",
  className,
  priority = false,
  alt = "Finekarts",
}: Props) {
  const s = SIZES[size];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 shadow-[0_2px_12px_rgba(0,0,0,0.2)] ring-1 ring-white/30",
        s.box,
        className,
      )}
    >
      <Image
        src={BRAND_LOGO_SRC}
        alt={alt}
        width={s.px}
        height={s.px}
        priority={priority}
        className="h-full w-full rounded-full object-cover"
      />
    </span>
  );
}
