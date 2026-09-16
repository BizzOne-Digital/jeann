import Image from "next/image";
import { marketingImageProps } from "@/lib/media/resolve-image-src";

const PANELS = [
  { position: "object-left", aria: true },
  { position: "object-center", aria: false },
  { position: "object-right", aria: false },
] as const;

type ImageTriptychProps = {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  priority?: boolean;
  rounded?: boolean;
  variant?: "aspect" | "fill";
};

export function ImageTriptych({
  src,
  alt,
  className = "",
  aspectClassName = "aspect-[21/9] sm:aspect-[24/9]",
  priority = false,
  rounded = true,
  variant = "aspect",
}: ImageTriptychProps) {
  const image = marketingImageProps(src);
  const gridClass =
    variant === "fill"
      ? "absolute inset-0 grid grid-cols-3 gap-1 sm:gap-1.5"
      : `grid grid-cols-3 gap-1.5 sm:gap-2 ${aspectClassName} ${rounded ? "overflow-hidden rounded-xl" : ""}`;

  return (
    <div className={`${gridClass} ${className}`} aria-hidden={variant === "fill" && !alt}>
      {PANELS.map((panel, index) => (
        <div key={index} className="relative min-h-0 overflow-hidden bg-[#e4e0d8]">
          <Image
            src={image.src}
            alt={panel.aria ? alt : ""}
            fill
            priority={priority && (variant === "fill" || index === 1)}
            sizes="34vw"
            unoptimized={image.unoptimized}
            className={`object-cover ${panel.position}`}
          />
        </div>
      ))}
    </div>
  );
}
