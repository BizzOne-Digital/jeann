import type { Metadata } from "next";
import { getAllPublicProducts, getPublicCategories } from "@/lib/content/catalog-server";
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

export default async function ProductsPage() {
  const categories = await getPublicCategories();
  const products = await getAllPublicProducts();

  return (
    <>
      <ProductsHero />
      <FoodSafetyAgencyMarquee />
      <CategoryShowcase categories={categories} />
      <ProductCatalogSection categories={categories} products={products} totalCount={products.length} />
      <ProductsCta />
    </>
  );
}
