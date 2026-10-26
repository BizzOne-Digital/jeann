import { Fragment } from "react";

/**
 * Renders CMS text with light inline markup: `**bold**` and `*italic*`.
 * The first bold segment gets `boldClassName` (used for lead-in labels).
 */
export function CmsInlineText({
  text,
  boldClassName,
}: {
  text: string;
  boldClassName?: string;
}) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  const isBold = (part: string) => part.startsWith("**") && part.endsWith("**") && part.length > 4;
  const firstBoldIndex = parts.findIndex(isBold);
  return (
    <>
      {parts.map((part, i) => {
        if (isBold(part)) {
          const cls = i === firstBoldIndex ? boldClassName : undefined;
          return (
            <strong key={i} className={cls}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
