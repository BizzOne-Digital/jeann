import { requirePortalAccess } from "@/lib/auth/portal-access";
import { getBuyerFormDefaults } from "@/lib/auth/buyer-profile";
import { getPackagingCatalog } from "@/lib/content/packaging-catalog";
import { EDIBLE_OIL_PRODUCTS } from "@/lib/content/edible-oils";
import { PortalPage } from "@/components/portal/PortalPage";
import { EdibleOilOrderForm } from "@/components/marketing/EdibleOilOrderForm";

type Props = {
  searchParams: Promise<{ product?: string }>;
};

export default async function NewRequestPage({ searchParams }: Props) {
  const session = await requirePortalAccess("buyer");
  const prefill = await getBuyerFormDefaults(session);
  const { product: productSlug } = await searchParams;
  const packagingOptions = await getPackagingCatalog();
  const validSlug = EDIBLE_OIL_PRODUCTS.some((p) => p.slug === productSlug)
    ? productSlug
    : undefined;

  return (
    <PortalPage
      title="New edible oil order"
      description="Submit a structured RFQ for refined, crude, or extra edible oils with monthly volume, contract duration, Incoterms, and admin-enabled payment terms."
    >
      <div className="max-w-3xl rounded-lg border border-[var(--line)] bg-white p-5 sm:p-8">
        <EdibleOilOrderForm
          packagingOptions={packagingOptions}
          prefill={prefill}
          defaultProductSlug={validSlug}
        />
      </div>
    </PortalPage>
  );
}
