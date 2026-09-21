import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";
import { LOGISTICS_IMAGES } from "@/lib/content/logistics-images";

export const INSPECTIONS_STORY = {
  eyebrow: "How we trade",
  title: "Bulk commodities with independent inspection where the contract requires it",
  lead:
    "Finekarts sells agricultural and edible-oil cargoes to qualified buyers. Inspection is a tool — we appoint recognized independent firms at origin, loading, or destination when the PSA and bank call for documented quality and quantity evidence.",
  youtubeUrl: "https://www.youtube.com/watch?v=gADVpRPdr7E",
  showcaseImageSrc: "/images/inspections/warehouse-bulk-inspection.png",
  showcaseImageAlt:
    "SGS inspectors walking through a bulk commodity warehouse with stacked agricultural bags",
  imageSrc: "/images/inspections/sgs-laboratory-grain-sampling.png",
  imageAlt: "SGS inspector handling a grain sample in a laboratory",
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
  eyebrow: "Independent partners",
  title: "Recognized inspection and certification relationships",
  lead: "On commodity programmes we sell, Finekarts may appoint internationally known inspection, testing, and certification firms when contracts call for independent evidence — we coordinate them; we do not operate as those brands.",
  youtubeUrl: "https://www.youtube.com/watch?v=rJPI2UA25HQ",
  imageSrc: "/images/inspections/sampling-grain.png",
  imageAlt: "Grain sampling for independent verification",
  boxes: [
    {
      title: "Quality",
      body: "Partner networks cover agricultural commodities, edible oils, minerals, and petroleum — with scope-specific accreditation that should be confirmed for each port, laboratory, and service line.",
    },
    {
      title: "Safety",
      body: "Independent inspection scope can cover sanitary handling, packaging integrity, and documentary traceability from load port through discharge when agreed in the PSA.",
    },
    {
      title: "Punctuality",
      body: "Appointed surveyors align field attendance with vessel schedules and banking deadlines so certificates are issued when your transaction needs them.",
    },
  ] satisfies MarketingContentBox[],
};

export const VERIFICATION_STORY = {
  eyebrow: "Due diligence",
  title: "Evidence before we commit to a trade",
  lead:
    "Finekarts conducts bulk commodity trades through structured due diligence. We use trusted verification providers, commercial intelligence, validation, and inspection where appropriate — to assess parties, product, and supply chain before signing a PSA. We coordinate these tools; we are not the verification provider.",
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
      body: "Origin, manufacturer, and distributor verification assess production capacity, facilities, certifications and trade references — distinguishing established operators from limited intermediaries.",
    },
    {
      title: "Commodity",
      body: "Company verification and commodity verification are separate disciplines. Where required, independent inspection confirms inventory, quantity, quality and loading activities.",
    },
  ] satisfies MarketingContentBox[],
};

export const LOGISTICS_STORY = {
  eyebrow: "Logistics coordination",
  title: "Disciplined movement from load port to discharge",
  lead:
    "Finekarts is the seller on the commodity contract — not a freight forwarder or carrier. Whether you trade FOB or CIF, we coordinate shipment programmes with logistics partners so cargo, surveys, and transport documents stay aligned with your PSA and LC.",
  youtubeUrl: "https://www.youtube.com/watch?v=azLlZZ0t2CE",
  imageSrc: LOGISTICS_IMAGES.portTrucks.src,
  imageAlt: LOGISTICS_IMAGES.portTrucks.alt,
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
