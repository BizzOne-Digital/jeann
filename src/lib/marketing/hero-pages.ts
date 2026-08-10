/** Marketing routes that use a full-bleed PageHero (transparent header, no main top padding). */
export const HERO_PAGE_PREFIXES = [
  "/",
  "/about",
  "/products",
  "/trade",
  "/booking",
  "/contact",
  "/insights",
  "/packaging",
  "/shipping-documents",
  "/faq",
  "/team",
  "/testimonials",
  "/terms",
  "/privacy",
  "/cookies",
  "/buyer-terms",
  "/accessibility",
] as const;

export function isHeroMarketingPage(pathname: string): boolean {
  if (pathname === "/") return true;
  return HERO_PAGE_PREFIXES.some(
    (prefix) => prefix !== "/" && (pathname === prefix || pathname.startsWith(`${prefix}/`)),
  );
}
