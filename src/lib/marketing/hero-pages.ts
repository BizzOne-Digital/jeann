/** Marketing routes that use a full-bleed hero (no extra main padding-top). */
export const HERO_PAGE_PREFIXES = [
  "/",
  "/about",
  "/products",
  "/resources",
  "/partners",
  "/inspections",
  "/verification",
  "/logistics",
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
  "/buyer-request",
  "/supplier-offer",
] as const;

export function isHeroMarketingPage(pathname: string): boolean {
  if (pathname === "/") return true;
  return HERO_PAGE_PREFIXES.some(
    (prefix) => prefix !== "/" && (pathname === prefix || pathname.startsWith(`${prefix}/`)),
  );
}

/** Routes with a light (cream) PageHero — header stays solid, not transparent. */
export const LIGHT_HERO_PREFIXES = [] as const;

export function isLightHeroPage(pathname: string): boolean {
  return LIGHT_HERO_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
