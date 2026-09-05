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
