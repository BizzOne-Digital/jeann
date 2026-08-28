import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";

export const INSPECTIONS_STORY = {
  eyebrow: "Our objective",
  title: "Greater transparency, reduced risk, confidence in every shipment",
  lead: "Finekarts coordinates independent inspection at origin, during loading, in transit where applicable, and at destination — so buyers and sellers share documented evidence on quality, quantity, and compliance without replacing contractual due diligence or bank requirements.",
  youtubeUrl: "https://www.youtube.com/watch?v=gADVpRPdr7E",
  imageSrc: "/images/inspections/port-sampling.png",
  imageAlt: "Inspector sampling agricultural commodities at port",
  boxes: [
    {
      title: "Quality",
      body: "Commodity quality inspection and laboratory testing against contract — ICUMSA and polarization for sugar, moisture for grains, FFA for oils, and other agreed parameters.",
    },
    {
      title: "Safety",
      body: "Pre-shipment and loading supervision verify packaging, hold or tank suitability, seals, and chain of custody before cargo leaves origin.",
    },
    {
      title: "Punctuality",
      body: "Inspection scope and inspector appointment are aligned with laycan and banking presentation so certificates are issued when your transaction needs them.",
    },
  ] satisfies MarketingContentBox[],
};

export const PARTNERS_STORY = {
  eyebrow: "Verification partners",
  title: "Recognized inspection and certification relationships",
  lead: "We work with internationally known inspection, testing, and certification organizations so qualified buyers can build confidence in cargo, counterparties, and documents — partnership listings support transparency; they do not replace your contract terms.",
  youtubeUrl: "https://www.youtube.com/watch?v=nFFts9WyUm8",
  imageSrc: "/images/inspections/sampling-grain.png",
  imageAlt: "Grain sampling for independent verification",
  boxes: [
    {
      title: "Quality",
      body: "Partner networks cover agricultural commodities, edible oils, minerals, and petroleum — with scope-specific accreditation that should be confirmed for each port, laboratory, and service line.",
    },
    {
      title: "Safety",
      body: "Verification programmes support sanitary handling, packaging integrity, and documentary traceability from load port through discharge.",
    },
    {
      title: "Punctuality",
      body: "Appointed surveyors align field attendance with vessel schedules and banking deadlines so certificates are issued when your transaction needs them.",
    },
  ] satisfies MarketingContentBox[],
};

export const VERIFICATION_STORY = {
  eyebrow: "Due diligence",
  title: "Evidence-backed confidence before you commit",
  lead: "Finekarts Verification Services combines corporate registries, regulatory databases, commercial intelligence and independent inspection — so buyers and sellers can assess counterparties, supply chains and commodity claims with documented evidence rather than representations alone.",
  youtubeUrl: "https://www.youtube.com/watch?v=nFFts9WyUm8",
  imageSrc: "/images/inspections/cargo-inspector-loading.png",
  imageAlt: "Independent verification at commodity loading",
  boxes: [
    {
      title: "Identity",
      body: "Corporate registration, government records, licenses and sanctions screening establish whether the counterparty presented in negotiations corresponds with a legally established, operational business.",
    },
    {
      title: "Capability",
      body: "Supplier, manufacturer, distributor and buyer verification assess production capacity, facilities, certifications and trade references — distinguishing established operators from limited intermediaries.",
    },
    {
      title: "Commodity",
      body: "Company verification and commodity verification are separate disciplines. Where required, independent inspection confirms inventory, quantity, quality and loading activities.",
    },
  ] satisfies MarketingContentBox[],
};

export const LOGISTICS_STORY = {
  eyebrow: "Logistics",
  title: "Disciplined movement from load port to discharge",
  lead: "Whether you trade FOB or CIF, success depends on clear allocation of costs, risks, and documents. Finekarts structures shipment programmes so cargo, surveys, and transport papers stay aligned with your contract and banking instrument.",
  youtubeUrl: "https://www.youtube.com/watch?v=nFFts9WyUm8",
  imageSrc: "/images/hero-commodities.png",
  imageAlt: "Port logistics and commodity shipment",
  boxes: [
    {
      title: "Visibility",
      body: "Where carrier data is available, track vessel, container, booking, ports, transshipment, ETA and delivery milestones — with proactive communication when schedules change.",
    },
    {
      title: "Coordination",
      body: "Supplier, inspector, warehouse, terminal, carrier, freight forwarder, customs and buyer stay aligned through booking, loading, departure, transit and discharge.",
    },
    {
      title: "Reliability",
      body: "We plan carefully, monitor continuously and communicate proactively — while delivery dates remain subject to contract terms and factors outside our control.",
    },
  ] satisfies MarketingContentBox[],
};

/** @deprecated Use LOGISTICS_STORY */
export const SHIPPING_STORY = LOGISTICS_STORY;
