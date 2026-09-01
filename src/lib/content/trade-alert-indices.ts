/**
 * Indicative commodity reference lines for the public trade alert strip.
 * Not live pricing — replace with licensed feed (e.g. Vesper) when configured.
 */

export type TradeIndexLine = {
  id: string;
  label: string;
  value: string;
  change: string;
  direction: "up" | "down" | "flat";
};

export const TRADE_ALERT_DISCLAIMER =
  "Indicative references only — not offers, bids, or trading advice. Binding terms arise from agreed contracts.";

/** Sample indices for display until a licensed market-data feed is connected. */
export const TRADE_INDEX_LINES: TradeIndexLine[] = [
  {
    id: "sunflower-oil",
    label: "Sunflower oil (FOB Black Sea)",
    value: "USD 920–980 / MT",
    change: "▲ corridor dependent",
    direction: "up",
  },
  {
    id: "raw-sugar",
    label: "Raw sugar No. 11",
    value: "USD 18–21 c/lb",
    change: "— indicative band",
    direction: "flat",
  },
  {
    id: "white-sugar",
    label: "White sugar ICUMSA 45",
    value: "USD 540–620 / MT",
    change: "▲ grade & origin",
    direction: "up",
  },
  {
    id: "rice",
    label: "Long-grain white rice (5% broken)",
    value: "USD 480–560 / MT",
    change: "▼ origin spread",
    direction: "down",
  },
  {
    id: "soybean-oil",
    label: "Crude soybean oil",
    value: "USD 880–940 / MT",
    change: "— indicative band",
    direction: "flat",
  },
];
