import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export const BRAND_LOGO_SRC = "/brand/finekarts-logo.png";

const SIZES = {
  sm: { box: "h-10 w-10 sm:h-11 sm:w-11", px: 44 },
  md: { box: "h-12 w-12", px: 48 },
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
        "relative inline-flex shrink-0 overflow-hidden rounded-full",
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
        className="h-full w-full object-contain"
      />
    </span>
  );
}
