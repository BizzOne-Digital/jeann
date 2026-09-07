/** Buyer portal RFQ entry — public CTAs should sign in first. */
export function buyerQuoteHref(productSlug?: string): string {
  return buyerOrderHref(productSlug);
}

/** Buyer portal order entry — sign in, then submit a purchase request. */
export function buyerOrderHref(productSlug?: string): string {
  const path = productSlug
    ? `/portal/buyer/new-request?product=${encodeURIComponent(productSlug)}`
    : "/portal/buyer/new-request";
  return `/login?next=${encodeURIComponent(path)}`;
}

export function buyerPortalHref(path = "/portal/buyer"): string {
  return `/login?next=${encodeURIComponent(path)}`;
}
