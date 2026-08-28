export type FoodSafetyMarket = {
  id: string;
  country: string;
  note: string;
};

/** Key export and import markets — food safety requirements confirmed per contract. No third-party logos required. */
export const FOOD_SAFETY_MARKETS: FoodSafetyMarket[] = [
  { id: "united-states", country: "United States", note: "FDA & USDA standards" },
  { id: "egypt", country: "Egypt", note: "National food safety authority" },
  { id: "netherlands", country: "Netherlands", note: "EU food safety regulations" },
  { id: "brazil", country: "Brazil", note: "Export sanitary requirements" },
  { id: "india", country: "India", note: "FSSAI-aligned programmes" },
  { id: "uae", country: "United Arab Emirates", note: "ESMA import standards" },
  { id: "thailand", country: "Thailand", note: "National food safety controls" },
  { id: "turkey", country: "Turkey", note: "Ministry of Agriculture standards" },
  { id: "saudi-arabia", country: "Saudi Arabia", note: "SFDA import requirements" },
  { id: "united-kingdom", country: "United Kingdom", note: "UK food safety law" },
];
