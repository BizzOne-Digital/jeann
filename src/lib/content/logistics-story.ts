import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";
import { LOGISTICS_PAGE_ONLY_IMAGES } from "@/lib/content/logistics-images";

/** Story block for `/logistics` only. */
export const LOGISTICS_STORY = {
  eyebrow: "Logistics coordination",
  title: "Disciplined movement from load port to discharge",
  lead:
    "Finekarts is the seller on the commodity contract — not a freight forwarder or carrier. Whether you trade FOB or CIF, we coordinate shipment programmes with logistics partners so cargo, surveys, and transport documents stay aligned with your PSA and LC.",
  youtubeUrl: "https://www.youtube.com/watch?v=azLlZZ0t2CE",
  imageSrc: LOGISTICS_PAGE_ONLY_IMAGES.storyInTheField.src,
  imageAlt: LOGISTICS_PAGE_ONLY_IMAGES.storyInTheField.alt,
  boxes: [
    {
      title: "Visibility",
      body:
        "Where carrier data is available, track vessel, container, booking, ports, transshipment, ETA and delivery milestones — with proactive communication when schedules change.",
    },
    {
      title: "Coordination",
      body:
        "Supplier, inspector, warehouse, terminal, carrier, freight forwarder, customs and buyer stay aligned through booking, loading, departure, transit and discharge.",
    },
    {
      title: "Reliability",
      body:
        "We plan carefully, monitor continuously and communicate proactively — while delivery dates remain subject to contract terms and factors outside our control.",
    },
  ] satisfies MarketingContentBox[],
} as const;
