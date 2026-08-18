/** Buyer portal RFQ entry — public CTAs should sign in first. */
export function buyerQuoteHref(productSlug?: string): string {
  const base = "/login?next=" + encodeURIComponent(
    productSlug
      ? `/portal/buyer/new-request?product=${encodeURIComponent(productSlug)}`
      : "/portal/buyer/new-request",
  );
  return base;
}

export function buyerPortalHref(path = "/portal/buyer"): string {
  return `/login?next=${encodeURIComponent(path)}`;
}
