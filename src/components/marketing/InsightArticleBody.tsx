"use client";

import { StaggerReveal } from "@/components/motion/StaggerReveal";

export function InsightArticleBody({ paragraphs }: { paragraphs: string[] }) {
  return (
    <StaggerReveal
      className="prose-trade mt-10 space-y-6 text-base leading-relaxed text-[#333333]"
      stagger={0.05}
      y={18}
    >
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </StaggerReveal>
  );
}
