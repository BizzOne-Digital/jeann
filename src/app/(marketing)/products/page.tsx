import type { Metadata } from "next";
import { getAllProducts, getCategories } from "@/lib/content/catalog";
import {
  ProductsHero,
  CategoryShowcase,
  ProductCatalogSection,
  ProductsCta,
} from "@/components/marketing/ProductSections";
import { FoodSafetyAgencyMarquee } from "@/components/marketing/FoodSafetyAgencyMarquee";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse Finekarts commodity categories and product overviews. Specifications are confirmed with the trade desk — not fixed public prices.",
};

export default function ProductsPage() {
  const categories = getCategories();
  const products = getAllProducts();

  return (
    <>
      <ProductsHero />
      <FoodSafetyAgencyMarquee />
      <CategoryShowcase categories={categories} />
      <ProductCatalogSection categories={categories} totalCount={products.length} />
      <ProductsCta />
    </>
  );
}
