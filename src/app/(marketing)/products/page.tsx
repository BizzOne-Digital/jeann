import type { Metadata } from "next";
import { getAllPublicProducts, getPublicCategories } from "@/lib/content/catalog-server";
import {
  ProductsHero,
  CategoryShowcase,
  ProductCatalogSection,
  ProductsCta,
} from "@/components/marketing/ProductSections";
import { FoodSafetyAgencyMarquee } from "@/components/marketing/FoodSafetyAgencyMarquee";
import { ProductQualitySpotlight } from "@/components/marketing/ProductQualitySpotlight";
import { resolveProductsSpotlight } from "@/lib/marketing/products-cms";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { getEffectiveSectionFields, getPublishedPage } from "@/lib/content/page-content";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("products", {
    title: "Products",
    description:
      "Browse Finekarts commodity categories and product overviews. Specifications are confirmed with the trade desk — not fixed public prices.",
  });
}

export default async function ProductsPage() {
  const categories = await getPublicCategories();
  const products = await getAllPublicProducts();
  const cms = await getPublishedPage("products");
  const spotlight = resolveProductsSpotlight(getEffectiveSectionFields(cms, "spotlight"));

  return (
    <>
      <ProductsHero cms={getEffectiveSectionFields(cms, "hero")} />
      <FoodSafetyAgencyMarquee cms={getEffectiveSectionFields(cms, "food-safety")} />
      <ProductQualitySpotlight
        spotlights={spotlight.cards}
        content={spotlight}
        variant="navy"
      />
      <CategoryShowcase
        categories={categories}
        cms={getEffectiveSectionFields(cms, "categories")}
      />
      <ProductCatalogSection
        categories={categories}
        products={products}
        totalCount={products.length}
        cms={getEffectiveSectionFields(cms, "catalog")}
      />
      <ProductsCta cms={getEffectiveSectionFields(cms, "cta")} />
    </>
  );
}
