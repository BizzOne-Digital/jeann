export function SiteJsonLd() {
  const base = process.env.APP_URL || "https://finekarts.vercel.app";

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Finekarts Incorporated",
    url: base,
    logo: `${base}/favicon.png`,
    description:
      "Global agricultural commodity trading — bulk edible oils, sugar, beans, rice, and related cargoes for qualified international buyers.",
    email: "trade@finekarts.com",
    sameAs: [] as string[],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Finekarts Incorporated",
    url: base,
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
