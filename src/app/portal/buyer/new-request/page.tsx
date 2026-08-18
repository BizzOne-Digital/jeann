import { requirePortalAccess } from "@/lib/auth/portal-access";
import { getBuyerFormDefaults } from "@/lib/auth/buyer-profile";
import { getPackagingCatalog } from "@/lib/content/packaging-catalog";
import { PortalPage } from "@/components/portal/PortalPage";
import { PurchaseRequestForm } from "@/components/marketing/PurchaseRequestForm";

type Props = {
  searchParams: Promise<{ product?: string }>;
};

export default async function NewRequestPage({ searchParams }: Props) {
  const session = await requirePortalAccess("buyer");
  const prefill = await getBuyerFormDefaults(session);
  const { product: productSlug } = await searchParams;
  const packagingOptions = await getPackagingCatalog();

  return (
    <PortalPage
      title="New purchase request"
      description="Submit an RFQ to the Finekarts trade desk. Add one or more product lines with packaging for each."
    >
      <div className="max-w-3xl rounded-lg border border-[var(--line)] bg-white p-5 sm:p-8">
        <PurchaseRequestForm
          packagingOptions={packagingOptions}
          prefill={prefill}
          defaultProduct={productSlug ? { slug: productSlug, name: productSlug.replace(/-/g, " ") } : undefined}
        />
      </div>
    </PortalPage>
  );
}
