/** Client-approved logistics page content (Global Shipping & Logistics). */

export const ICC_INCOTERMS_2020_URL =
  "https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/";

export const LOGISTICS_HERO = {
  eyebrow: "Trade logistics coordination",
  title: "Moving commodities from origin to destination",
  description:
    "Finekarts is the seller on the commodity contract — not a freight forwarder or carrier. On FOB and CIF programmes we coordinate carriers, forwarders, marine cargo insurance under CIF, and PSA-aligned documentation with independent partners.",
  primaryCta: { href: "#request-quote", label: "Discuss shipping on your trade →" },
  secondaryCta: { href: "#incoterms", label: "FOB, CIF & DDP terms" },
};

export const GLOBAL_SHIPPING_COVERAGE = {
  title: "Global shipping coverage",
  lead: "Programmes we sell are structured using recognized Incoterms® rules, including:",
  incoterms: ["EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"],
  note:
    "While Finekarts can structure transactions around various Incoterms® depending on commercial requirements, our standard international terms are FOB and CIF. DDP may be available when the supplier and buyer are in the same country.",
};

/** FOB, CIF, and conditional DDP — see ICC Incoterms® 2020. */
export const FOB_CIF_TERMS = [
  {
    code: "FOB",
    title: "Free On Board",
    summary:
      "Under FOB transactions, the seller is responsible for delivering the cargo on board the nominated vessel at the agreed port of shipment. The buyer manages the main ocean freight and destination arrangements according to the contract.",
  },
  {
    code: "CIF",
    title: "Cost, Insurance & Freight",
    summary:
      "Under CIF, Finekarts coordinates cargo, ocean freight, and marine cargo (trade) insurance to the named destination port — coverage scope and claims handling are stated in the PSA, subject to Incoterms® rules.",
  },
  {
    code: "DDP",
    title: "Delivered Duty Paid",
    summary:
      "DDP may be offered only when the supplier and the buyer are in the same country. The buyer does not need to attend the port to clear the shipment through customs — goods can be delivered to the buyer’s business address, subject to contract and local rules.",
  },
];

export const COMMERCIAL_INCOTERMS_PRIMARY_NOTE =
  "FOB and CIF are our primary international commercial shipping terms. DDP is available only when the goods are located in the same country as the buyer.";

export const REAL_TIME_TRACKING = {
  title: "Real-time shipment tracking",
  lead: "Visibility matters when you're moving high-value commodities across international borders. Where carrier and logistics-system data is available on programmes we sell, we share shipment tracking updates with buyers, including:",
  items: [
    "Vessel identification and container number",
    "Booking information, port of loading and port of discharge",
    "Vessel departure and transshipment information",
    "Current shipment status and estimated time of arrival (ETA)",
    "Port arrival and delivery milestones",
  ],
  note:
    "Where carrier data is available, we share tracking updates with buyers on programmes we sell — Finekarts is the trader, not the freight operator.",
};

export const ETA_MONITORING = {
  title: "ETA monitoring",
  lead: "Finekarts monitors planned shipping milestones and communicates important changes that may affect the expected arrival schedule.",
  flow: "Booking → Loading → Departure → Transit → Transshipment → Arrival → Discharge → Delivery",
  note: "When carriers provide updated ETA information, Finekarts can communicate relevant schedule changes to the customer.",
  goal: "Accurate planning. Clear communication. Reliable execution.",
};

export const PORT_TO_PORT_CHAIN = {
  title: "Global port-to-port logistics",
  lead:
    "Finekarts sells bulk commodities and coordinates international shipments between major producing and consuming markets. Shipment programmes we structure may involve:",
  steps: [
    "Supplier / Factory",
    "Origin warehouse / terminal",
    "Port of loading",
    "Ocean freight",
    "Transshipment — where applicable",
    "Destination port",
    "Discharge",
    "Buyer / final delivery",
  ],
  note: "The specific logistics chain depends on the commodity, origin, destination, vessel, shipping schedule and contractual terms.",
};

export const SHIPPING_MODES = [
  {
    title: "Bulk vessel",
    text: "For large-volume commodities such as sugar, grains, rice and other dry bulk products.",
  },
  {
    title: "Tanker vessel",
    text: "For liquid commodities such as crude and refined edible oils.",
  },
  {
    title: "Container shipping",
    text: "For packaged commodities, smaller shipments and products requiring containerized transportation.",
  },
  {
    title: "Flexitank",
    text: "For suitable liquid commodities transported inside standard shipping containers.",
  },
  {
    title: "ISO tank",
    text: "For selected liquid cargo requiring specialized tank transportation.",
  },
  {
    title: "Bagged & palletized cargo",
    text: "For rice, sugar, grains, pulses and other packaged commodities.",
  },
];

export const SHIPPING_DOCUMENTATION = {
  title: "Shipping documentation",
  lead: "Finekarts coordinates the commercial and shipping documentation required for each transaction, subject to the applicable contract and destination requirements.",
  intro: "Documentation may include:",
  items: [
    "Commercial invoice and packing list",
    "Bill of lading and certificate of origin",
    "Certificate of quality, quantity/weight and analysis",
    "Inspection certificate",
    "Phytosanitary certificate and health certificate where applicable",
    "Insurance certificate for CIF shipments",
    "Export, customs and other destination-specific documentation",
  ],
  note: "Documentary requirements are established according to the commodity, origin, destination, buyer requirements, applicable regulations and agreed payment terms.",
};

export const SHIPMENT_COORDINATION = {
  title: "Shipment coordination",
  lead: "Finekarts trade operations coordinate with carriers, forwarders, terminals, and other parties throughout the shipping process — as seller on the commodity contract:",
  parties: "Supplier → Inspector → Warehouse → Terminal → Carrier → Freight forwarder → Customs → Buyer",
  note: "This coordination helps reduce communication gaps and keeps stakeholders informed about important shipment milestones.",
};

export const DELIVERY_RELIABILITY = {
  title: "Delivery reliability",
  lead: "Finekarts is committed to reliable delivery and proactive shipment management. We work to meet the agreed contractual delivery schedule by coordinating:",
  items: [
    "Supplier readiness and cargo availability",
    "Inspection, loading and vessel booking",
    "Shipping documentation and ocean transportation",
    "Port operations, customs requirements and destination coordination",
  ],
  commitment:
    "We plan carefully. We monitor continuously. We communicate proactively. We work to deliver according to the agreed contract.",
  disclaimer:
    "However, actual arrival times can be affected by factors outside Finekarts' control, including weather, port congestion, vessel delays, customs, government actions, carrier schedule changes and force majeure events. Therefore, delivery dates and ETA are subject to the specific contractual terms and applicable Incoterms® rules.",
};

export const CONTRACT_TO_CARGO_STEPS = [
  { step: 1, title: "Contract", text: "Agree on commodity, quantity, specifications, price, destination and delivery terms." },
  { step: 2, title: "Supplier confirmation", text: "Confirm product availability and shipping readiness." },
  { step: 3, title: "Inspection", text: "Arrange quality, quantity and loading inspection where required." },
  { step: 4, title: "Booking", text: "Coordinate vessel or container transportation." },
  { step: 5, title: "Loading", text: "Monitor cargo loading and required documentation." },
  { step: 6, title: "Departure", text: "Confirm shipment departure and provide available tracking information." },
  { step: 7, title: "In transit", text: "Monitor shipment status and communicate material updates." },
  { step: 8, title: "Arrival", text: "Track ETA and coordinate destination requirements." },
  { step: 9, title: "Delivery", text: "Complete the agreed delivery process in accordance with the applicable contract and Incoterms® rules." },
];

export const LOGISTICS_CLOSING = {
  title: "CIF, insurance, and coordinated movement.",
  lead: "Finekarts sells bulk commodities to qualified buyers and coordinates independent inspection, trade documentation, marine insurance under CIF, and carriage with carriers and forwarders — responsibilities are defined in the signed PSA, not by Finekarts acting as a logistics operator.",
  body: "We align export documentation and insurance with the PSA before cargo sails, and work with buyers on destination requirements during structuring to reduce clearance delays.",
  tagline: "Commodity sale first. Carriage coordinated to contract.",
  badges: ["FOB & CIF", "Coordinated marine insurance", "Carrier visibility", "PSA documentation"],
};

export const LOGISTICS_CTA = {
  title: "Discuss shipping on your trade",
  lead: "Tell us your commodity, quantity, origin, destination, preferred Incoterms, and delivery requirements. The trade desk will explain how freight and documentation fit your PSA — through carriers and forwarders, not as a standalone Finekarts logistics product.",
  fields: ["Commodity", "Quantity", "Origin", "Destination", "Incoterms", "Delivery terms"],
};

export const INCOTERMS_DISCLAIMER =
  "Incoterms® is a registered trademark of the International Chamber of Commerce (ICC). The applicable Incoterms® rule should always be specified in the sales contract together with the named place or port and the relevant edition (see ICC Incoterms® 2020).";
