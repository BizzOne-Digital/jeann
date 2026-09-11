export type TestimonialRating = 1 | 2 | 3 | 4 | 5;

export function clampRating(value: number | undefined | null): TestimonialRating {
  const rounded = Math.round(value ?? 5);
  if (rounded < 1) return 1;
  if (rounded > 5) return 5;
  return rounded as TestimonialRating;
}

export function testimonialInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function formatTestimonialDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}
