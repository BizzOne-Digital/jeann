import { Reveal, MaskedHeadline } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow ? (
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ocean">{eyebrow}</p>
        </Reveal>
      ) : null}
      <MaskedHeadline
        text={title}
        as="h2"
        className="display mt-3 text-3xl text-ink sm:text-4xl md:text-[2.6rem]"
      />
      <div className={cn("gold-rule mt-5", align === "center" && "mx-auto")} />
      {description ? (
        <Reveal delay={0.1}>
          <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
