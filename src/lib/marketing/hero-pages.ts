/** Marketing routes that use a full-bleed PageHero (transparent header on dark heroes). */
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
] as const;

/** Light PageHero band — header must stay solid (not transparent white-on-cream). */
export const LIGHT_HERO_PREFIXES = [
  "/resources",
  "/partners",
  "/contact",
  "/packaging",
  "/booking",
  "/inspections",
  "/verification",
  "/logistics",
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

export function isLightHeroPage(pathname: string): boolean {
  return LIGHT_HERO_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
