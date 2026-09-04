import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";
import type { ProductMarketingExtras } from "@/lib/content/sugar-product-content";

export type PulseProductDetail = {
  slug: string;
  grade: string;
  subtitle: string;
  description: string;
  applications: string[];
  characteristics: string[];
  packaging: string[];
  note?: string;
  highlights: string[];
  heroImage?: string;
  images?: { src: string; alt: string }[];
};

const PILLARS: MarketingContentBox[] = [
  {
    title: "Quality",
    body: "Moisture, foreign matter, calibration, and defect counts are agreed in writing before shipment. Independent inspection and laboratory certificates can be appointed to match your contract.",
  },
  {
    title: "Safety",
    body: "Food-grade handling, sealed bags and liners, and documented chain of custody reduce contamination risk. Phytosanitary and weight certificates are prepared for the agreed destination.",
  },
  {
    title: "Punctuality",
    body: "Loading windows, container nominations, and document presentation dates are coordinated with your banking and logistics teams so cargo and paperwork arrive on schedule.",
  },
];

export const BEANS_CATEGORY = {
  eyebrow: "Beans",
  title: "Dry beans for global food supply chains",
  lead: "Finekarts supplies kidney, white, red, pinto, and other bean programmes for wholesalers, distributors, and food manufacturers. Calibration, moisture, and packing are confirmed per enquiry and contract.",
  products: [
    "Kidney beans",
    "White beans",
    "Red speckled beans",
    "Pinto beans",
    "Black beans",
  ],
  disclaimer:
    "Specifications, availability, origin, and certifications are subject to the individual supply contract and destination-market requirements.",
};

const BEANS_BASE = "/images/products/beans";
/** Client-approved mosaic used on every beans catalog listing. */
const BEANS_LISTING_IMAGE = `${BEANS_BASE}/beans-variety-mosaic.png`;

const PULSE_PRODUCTS: Record<string, PulseProductDetail> = {
  "kidney-beans": {
    slug: "kidney-beans",
    grade: "Kidney beans",
    subtitle: "Dark red kidney beans",
    description:
      "Dark red kidney beans for food manufacturing, canning, and distribution channels. Size, moisture, and defect limits are confirmed per contract and Certificate of Analysis.",
    applications: [
      "Food manufacturing",
      "Canning and prepared foods",
      "Wholesale distribution",
      "Food-service supply",
    ],
    characteristics: [
      "Characteristic kidney shape",
      "Deep red colour when sorted",
      "Calibration and moisture per contract",
      "Container and bulk bag programmes",
    ],
    packaging: ["FIBCs/jumbo bags", "Multi-wall sacks", "Container liners"],
    highlights: [
      "Dark red kidney beans for food channels",
      "Calibration and moisture per contract",
      "Independent inspection available",
    ],
    heroImage: `${BEANS_BASE}/red-kidney-bowl.png`,
    images: [
      {
        src: `${BEANS_BASE}/red-kidney-bowl.png`,
        alt: "Dark red kidney beans in a wooden bowl",
      },
      {
        src: `${BEANS_BASE}/beans-variety-mosaic.png`,
        alt: "Assorted dry bean varieties including kidney, pinto, and black grades",
      },
      {
        src: `${BEANS_BASE}/beans-variety-bowls.png`,
        alt: "Assorted dry bean varieties in ceramic bowls",
      },
    ],
  },
  "white-beans": {
    slug: "white-beans",
    grade: "White beans",
    subtitle: "Large white kidney beans",
    description:
      "Large white kidney beans (cannellini, great northern, and similar grades) for food manufacturing and distribution. Clean, uniform calibration and low defect counts are confirmed per shipment.",
    applications: [
      "Food manufacturing",
      "Soups and prepared meals",
      "Wholesale distribution",
      "Canning programmes",
    ],
    characteristics: [
      "Creamy white colour",
      "Large oval or kidney shape",
      "Low foreign matter",
      "Moisture per contract specification",
    ],
    packaging: ["FIBCs/jumbo bags", "Multi-wall sacks", "Container liners"],
    highlights: [
      "Large white beans for food and canning",
      "Uniform calibration programmes",
      "Container-based supply",
    ],
    heroImage: `${BEANS_BASE}/white-beans-leaves.png`,
    images: [
      {
        src: `${BEANS_BASE}/white-beans-leaves.png`,
        alt: "Large white kidney beans with decorative green leaves",
      },
      {
        src: `${BEANS_BASE}/white-beans-plate.png`,
        alt: "Large white kidney beans on a serving plate",
      },
      {
        src: `${BEANS_BASE}/white-beans-spoons.png`,
        alt: "Large white beans presented in wooden spoons",
      },
    ],
  },
  "red-beans": {
    slug: "red-beans",
    grade: "Red speckled beans",
    subtitle: "Red speckled and cranberry-style beans",
    description:
      "Red speckled beans — also traded as cranberry or borlotti-style grades — for food manufacturing and distribution. Colour pattern, calibration, and moisture are confirmed per contract.",
    applications: [
      "Food manufacturing",
      "Soups and stews",
      "Wholesale distribution",
      "Retail and food-service supply",
    ],
    characteristics: [
      "Cream base with red or maroon speckling",
      "Oval kidney shape",
      "Sorted calibration programmes",
      "Low defect and foreign matter limits",
    ],
    packaging: ["FIBCs/jumbo bags", "Multi-wall sacks", "Container liners"],
    highlights: [
      "Red speckled beans for food channels",
      "Sorted calibration per contract",
      "Phytosanitary documentation available",
    ],
    heroImage: `${BEANS_BASE}/red-speckled-pile.jpg`,
    images: [
      {
        src: `${BEANS_BASE}/red-speckled-pile.jpg`,
        alt: "Red speckled beans — top-down product reference",
      },
      {
        src: `${BEANS_BASE}/red-speckled-macro.png`,
        alt: "Close-up of red speckled bean texture and markings",
      },
      {
        src: `${BEANS_BASE}/red-beans-white-dish.png`,
        alt: "Red speckled beans in a white ceramic dish",
      },
      {
        src: `${BEANS_BASE}/red-speckled-spoon-fabric.png`,
        alt: "Red speckled beans with a wooden spoon on linen fabric",
      },
      {
        src: `${BEANS_BASE}/speckled-beans-bowls.png`,
        alt: "Red speckled beans in ceramic bowls",
      },
      {
        src: `${BEANS_BASE}/beans-variety-mosaic.png`,
        alt: "Assorted speckled and kidney bean varieties",
      },
    ],
  },
  "pinto-beans": {
    slug: "pinto-beans",
    grade: "Pinto beans",
    subtitle: "Speckled pinto beans",
    description:
      "Pinto beans with characteristic cream-and-red mottling for food manufacturing, canning, and distribution. Calibration, moisture, and defect limits are agreed per contract.",
    applications: [
      "Food manufacturing",
      "Canning and prepared foods",
      "Mexican and Latin American food programmes",
      "Wholesale distribution",
    ],
    characteristics: [
      "Cream base with red speckles and streaks",
      "Oval shape with smooth skin",
      "Sorted size grades",
      "Container and bulk bag supply",
    ],
    packaging: ["FIBCs/jumbo bags", "Multi-wall sacks", "Container liners"],
    highlights: [
      "Speckled pinto beans for food and canning",
      "Sorted calibration programmes",
      "Independent inspection aligned to contract",
    ],
    heroImage: `${BEANS_BASE}/pinto-beans-pile.png`,
    images: [
      {
        src: `${BEANS_BASE}/pinto-beans-pile.png`,
        alt: "Speckled pinto beans — close-up product reference",
      },
      {
        src: `${BEANS_BASE}/pinto-beans-bowls.jpg`,
        alt: "Speckled pinto beans in white ceramic bowls",
      },
      {
        src: `${BEANS_BASE}/pinto-beans-basket.png`,
        alt: "Speckled pinto beans in a woven basket",
      },
      {
        src: `${BEANS_BASE}/speckled-beans-bowls.png`,
        alt: "Speckled pinto beans in ceramic bowls",
      },
      {
        src: `${BEANS_BASE}/pinto-beans-spoon-display.png`,
        alt: "Speckled pinto beans with a wooden spoon",
      },
      {
        src: `${BEANS_BASE}/pinto-beans-spoon.png`,
        alt: "Speckled pinto beans in a wooden spoon — product reference",
      },
      {
        src: `${BEANS_BASE}/beans-variety-bowls.png`,
        alt: "Assorted speckled and red bean varieties in bowls",
      },
    ],
  },
  chickpeas: {
    slug: "chickpeas",
    grade: "Chickpeas",
    subtitle: "Dry chickpeas (garbanzo beans)",
    description:
      "Dry chickpeas for food manufacturing, hummus production, and distribution channels. Size (calibre), moisture, and defect counts are confirmed per contract and Certificate of Analysis.",
    applications: [
      "Food manufacturing",
      "Hummus and prepared foods",
      "Canning programmes",
      "Wholesale and food-service supply",
    ],
    characteristics: [
      "Creamy beige colour",
      "Characteristic rounded shape with beak",
      "Sorted calibre programmes",
      "Low moisture and foreign matter",
    ],
    packaging: ["FIBCs/jumbo bags", "Multi-wall sacks", "Container liners"],
    highlights: [
      "Dry chickpeas for food and canning",
      "Calibre sorting per contract",
      "Container programmes common",
    ],
    heroImage: BEANS_LISTING_IMAGE,
    images: [
      {
        src: `${BEANS_BASE}/dry-chickpeas.png`,
        alt: "Dry chickpeas — bulk product reference",
      },
      {
        src: `${BEANS_BASE}/beans-variety-mosaic.png`,
        alt: "Dry chickpeas and assorted beans",
      },
    ],
  },
  "black-beans": {
    slug: "black-beans",
    grade: "Black beans",
    subtitle: "Black turtle beans",
    description:
      "Black beans for food manufacturing and distribution. Size, moisture, and defect limits are confirmed per contract during RFQ review.",
    applications: [
      "Food manufacturing",
      "Canning and prepared foods",
      "Wholesale distribution",
      "Latin American food programmes",
    ],
    characteristics: [
      "Glossy black skin",
      "Small oval shape",
      "Sorted calibration",
      "Container bag programmes",
    ],
    packaging: ["FIBCs/jumbo bags", "Multi-wall sacks", "Container liners"],
    highlights: [
      "Black turtle beans for food channels",
      "Calibration per contract",
      "Phytosanitary documentation available",
    ],
    heroImage: `${BEANS_BASE}/black-beans-wooden-bowl.png`,
    images: [
      {
        src: `${BEANS_BASE}/black-beans-wooden-bowl.png`,
        alt: "Black turtle beans in a polished wooden bowl",
      },
      {
        src: `${BEANS_BASE}/black-beans-white-bowl.png`,
        alt: "Glossy black beans in a white ceramic bowl",
      },
      {
        src: `${BEANS_BASE}/beans-variety-mosaic.png`,
        alt: "Assorted dry bean varieties including black, kidney, and speckled grades",
      },
    ],
  },
  soybeans: {
    slug: "soybeans",
    grade: "Soybeans",
    subtitle: "Food-grade and commodity soybeans",
    description:
      "Soybean programmes for food processors and commodity buyers. Protein content, moisture, and foreign matter limits are confirmed per contract.",
    applications: [
      "Food manufacturing",
      "Soy product processing",
      "Animal feed where contractually agreed",
      "Industrial processing",
    ],
    characteristics: [
      "Round yellow seed",
      "Protein and oil content per specification",
      "Bulk and bagged programmes",
      "Origin and crop year confirmed per contract",
    ],
    packaging: ["FIBCs/jumbo bags", "Multi-wall sacks", "Bulk vessel holds"],
    highlights: [
      "Soybean programmes for food and commodity channels",
      "Protein specification per contract",
      "Bulk and container options",
    ],
    heroImage: `${BEANS_BASE}/soybeans.png`,
    images: [
      {
        src: `${BEANS_BASE}/soybeans.png`,
        alt: "Yellow soybeans with wooden spoon — product reference",
      },
    ],
  },
};

export function getPulseProductDetail(slug: string): PulseProductDetail | null {
  return PULSE_PRODUCTS[slug] ?? null;
}

export function getPulseProductMarketing(slug: string): ProductMarketingExtras | null {
  const product = PULSE_PRODUCTS[slug];
  if (!product) return null;
  return {
    description: product.description,
    contentBoxes: PILLARS,
    highlights: product.highlights,
  };
}

export function isBeansCategory(slug: string): boolean {
  return slug === "beans-and-pulses";
}
