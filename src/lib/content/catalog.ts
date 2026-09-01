import { SEED_CATEGORIES, SEED_PACKAGING, SITE, type SeedCategory, type SeedProduct } from "./seed-catalog";
import { searchCatalogProducts } from "./catalog-utils";

export type { SeedCategory, SeedProduct };
export { SEED_CATEGORIES, SEED_PACKAGING, SITE };

/** @deprecated Prefer `getPublicSite()` from catalog-server on server pages. */
export function getSite() {
  return SITE;
}

/** @deprecated Prefer `getPublicCategories()` from catalog-server on server pages. */
export function getCategories(): SeedCategory[] {
  return SEED_CATEGORIES;
}

export function getCategory(slug: string): SeedCategory | undefined {
  return SEED_CATEGORIES.find((c) => c.slug === slug);
}

export function getProduct(
  categorySlug: string,
  productSlug: string,
): { category: SeedCategory; product: SeedProduct } | undefined {
  const category = getCategory(categorySlug);
  if (!category) return undefined;
  const product = category.products.find((p) => p.slug === productSlug);
  if (!product) return undefined;
  return { category, product };
}

export function getAllProducts(): Array<SeedProduct & { categorySlug: string; categoryName: string }> {
  return SEED_CATEGORIES.flatMap((c) =>
    c.products.map((p) => ({ ...p, categorySlug: c.slug, categoryName: c.name })),
  );
}

export function searchProducts(
  query: string,
  categorySlug?: string,
  products?: Array<SeedProduct & { categorySlug: string; categoryName: string }>,
) {
  return searchCatalogProducts(products ?? getAllProducts(), query, categorySlug);
}

export function getPackaging() {
  return SEED_PACKAGING;
}

export const SEED_FAQS = [
  {
    question: "Do you publish fixed commodity prices?",
    answer:
      "No. Pricing is negotiated according to quantity, specifications, payment terms, inspection terms, destination, and Incoterms such as FOB or CIF.",
  },
  {
    question: "What Incoterms do you commonly discuss?",
    answer:
      "FOB and CIF are commonly discussed. Responsibilities and cost allocation depend on the agreed Incoterm and contract wording.",
  },
  {
    question: "Does submitting a purchase request guarantee supply?",
    answer:
      "No. Finekarts may review submitted opportunities, but submission does not guarantee acceptance, supply, pricing, financing, shipment, or closing.",
  },
  {
    question: "Can suppliers self-register?",
    answer:
      "Supplier access is invitation-only after Finekarts verification and approval. Buyers may self-register or join via secure invitation.",
  },
  {
    question: "What payment terms are sometimes discussed?",
    answer:
      "For large commodity SPAs, parties often discuss an irrevocable documentary LC at sight (UCP 600), with SBLC backup for long-term contracts (ISP98), and alternatives such as bank guarantees (URDG 758), D/P or D/A collection (URC 522), or T/T per the commercial schedule. For 12-month programmes, Irrevocable LC at Sight + SBLC is commonly positioned as the preferred structure. See the banking clause and comparison table on Resources — all instruments remain subject to contract, bank approval, compliance, and agreed wording.",
  },
];

export type SeedInsight = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  body: string[];
};

export const SEED_INSIGHTS: SeedInsight[] = [
  {
    slug: "fob-vs-cif-for-bulk-commodities",
    title: "FOB vs CIF for bulk agricultural commodities",
    excerpt:
      "A plain-language overview of how FOB and CIF allocate freight, insurance, and risk — not legal advice.",
    category: "Trade education",
    publishedAt: "2026-06-01",
    body: [
      "Incoterms describe where costs and risks transfer between seller and buyer. In bulk agricultural trade, FOB (Free On Board) and CIF (Cost, Insurance and Freight) are frequently discussed — but the exact allocation depends on contract wording, port definitions, and agreed documentation.",
      "Under FOB, the seller typically delivers goods on board the vessel at the named port of shipment. The buyer usually arranges and pays for main carriage and insurance from that point. Risk often passes when goods are on board, but parties should confirm the Incoterms edition and any special clauses.",
      "Under CIF, the seller typically contracts for carriage and minimum insurance to the named port of destination. The buyer receives documents needed to take delivery at destination. Insurance coverage, claims handling, and deductibles remain negotiable and should be stated clearly.",
      "Neither term guarantees price, quality, or performance on its own. Inspection, specifications, payment instruments, and force majeure clauses work alongside Incoterms. This article is educational only and not legal or shipping advice.",
    ],
  },
  {
    slug: "how-purchase-requests-work",
    title: "How Finekarts purchase requests work",
    excerpt:
      "What information helps the trade desk review an RFQ, and why submission is not a binding deal.",
    category: "Process",
    publishedAt: "2026-06-12",
    body: [
      "A purchase request (RFQ) gives the trade desk enough context to assess fit: product, quantity, destination, packaging preference, Incoterm direction, and realistic timing. Incomplete enquiries may still be reviewed, but response times improve when specifications are clear.",
      "Finekarts may match enquiries against supplier programmes, logistics corridors, and compliance requirements. Matching does not create a binding contract. Any offer, counter-offer, or acceptance happens only through agreed documentation — often after further diligence.",
      "Submitting a form on this website does not guarantee supply, pricing, financing, or shipment. Staff may request additional information, decline unsuitable enquiries, or propose alternative structures. Buyers should treat every stage as subject to verification.",
    ],
  },
  {
    slug: "packaging-options-in-bulk-trade",
    title: "Packaging options in bulk trade",
    excerpt:
      "Dry bulk, liquid bulk, and unpackaged vessel programmes — and why compatibility is product-specific.",
    category: "Logistics",
    publishedAt: "2026-07-02",
    body: [
      "Packaging in commodity trade is not one-size-fits-all. Dry goods may move in FIBCs, multi-wall sacks, or container liners. Liquids may use flexitanks, IBC totes, drums, or ISO tanks. Some programmes use unpackaged vessel or tanker holds where chemistry and route permit.",
      "Compatibility depends on product characteristics, moisture, density, handling equipment at origin and destination, and buyer facility constraints. A packaging type listed on a product page is an example until confirmed for a specific transaction.",
      "Inspection, stuffing/unstuffing, and demurrage risks can change with packaging choice. Discuss options early in the RFQ so quotations reflect realistic logistics.",
    ],
  },
  {
    slug: "document-checklists-are-route-specific",
    title: "Why shipping document checklists are route-specific",
    excerpt:
      "Bills of lading, certificates, and inspection documents vary by product, corridor, and bank requirements.",
    category: "Documents",
    publishedAt: "2026-07-20",
    body: [
      "Export and import documentation supports customs clearance, quality assurance, and payment under documentary credits. Typical categories include commercial invoice, packing list, bill of lading, certificate of origin, and product-specific certificates — but the exact set varies.",
      "Banks reviewing Letters of Credit may require particular wording, latest shipment dates, or named inspection agencies. Corridors with phytosanitary rules add further requirements. A checklist on a marketing page is illustrative, not a universal mandate.",
      "Finekarts coordinates document expectations during transaction setup. Final requirements are confirmed contractually and may change if routes, inspectors, or financing structures change.",
    ],
  },
];

export function getInsight(slug: string): SeedInsight | undefined {
  return SEED_INSIGHTS.find((p) => p.slug === slug);
}
