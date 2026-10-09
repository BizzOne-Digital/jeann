import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const DEFAULT_ABSTRACT = "/images/resources/intro-abstract-background.jpg";

type Props = {
  children: ReactNode;
  className?: string;
  /** Navy / footer-blue wash over the photo */
  overlayClassName?: string;
  imageSrc?: string;
  id?: string;
  "aria-label"?: string;
};

/** Full-width section with abstract photography and brand overlay — mid-page bands. */
export function MarketingAbstractBand({
  children,
  className,
  overlayClassName = "bg-[var(--footer-bg)]/88",
  imageSrc = DEFAULT_ABSTRACT,
  id,
  "aria-label": ariaLabel,
}: Props) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn("relative overflow-hidden border-b border-[#d5d0c8] text-white", className)}
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden
      />
      <div className={cn("pointer-events-none absolute inset-0", overlayClassName)} aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 18% 40%, rgba(200,142,74,0.28), transparent 55%), radial-gradient(circle at 82% 20%, rgba(255,255,255,0.06), transparent 50%)",
        }}
      />
      <div className="relative">{children}</div>
    </section>
  );
}
