import type { Metadata } from "next";
import { getAllProducts } from "@/lib/content/catalog";
import {
  TradeHero,
  TradeProcess,
  TradePathways,
  TradeIncoterms,
  TradeTerminology,
  TradePurchaseRequest,
  TradeOfferSection,
} from "@/components/marketing/TradeSections";

export const metadata: Metadata = {
  title: "How We Trade",
  description:
    "Buyer and supplier pathways, Incoterms, inspections, and trade document terminology in plain language. Submit RFQs or trade offers — no guaranteed outcomes.",
};

type Props = { searchParams: Promise<{ product?: string }> };

export default async function TradePage({ searchParams }: Props) {
  const { product: productSlug } = await searchParams;
  const products = getAllProducts();
  const selected = productSlug ? products.find((p) => p.slug === productSlug) : undefined;

  return (
    <>
      <TradeHero />
      <TradeProcess />
      <TradePathways />
      <TradeIncoterms />
      <TradeTerminology />
      <TradePurchaseRequest
        defaultProduct={
          selected ? { slug: selected.slug, name: selected.name } : undefined
        }
      />
      <TradeOfferSection />
    </>
  );
}
