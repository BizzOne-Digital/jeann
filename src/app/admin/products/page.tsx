import { requirePortalAccess } from "@/lib/auth/portal-access";
import { serializeCategory, serializeProduct } from "@/lib/admin/product-serializer";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminProductsManager } from "@/components/admin/AdminProductsManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requirePortalAccess("admin");
  const mongoConfigured = isMongoConfigured();
  const conn = mongoConfigured ? await tryConnectMongo() : null;

  let initialProducts: ReturnType<typeof serializeProduct>[] = [];
  let initialCategories: ReturnType<typeof serializeCategory>[] = [];

  if (conn) {
    const { Product, ProductCategory } = await import("@/models");
    const [products, categories] = await Promise.all([
      Product.find({ deletedAt: null }).sort({ displayOrder: 1, name: 1 }).lean(),
      ProductCategory.find({ deletedAt: null }).sort({ displayOrder: 1, name: 1 }).lean(),
    ]);
    const categoryById = new Map(categories.map((category) => [String(category._id), category]));
    initialProducts = products.map((product) =>
      serializeProduct(product, categoryById.get(String(product.categoryId))),
    );
    initialCategories = categories.map(serializeCategory);
  }

  return (
    <PortalPage
      title="Products"
      description="Manage commodities, categories, and catalog status. Add, edit, or delete products stored in MongoDB."
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--stone)]">
          Database:{" "}
          {conn
            ? `${initialProducts.length} products / ${initialCategories.length} categories`
            : mongoConfigured
              ? "MongoDB URI set but unreachable — edits cannot be saved until connection is restored."
              : "Not configured — set MONGODB_URI and run npm run seed."}
        </p>
        {!conn ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Product management requires a working MongoDB connection.
          </p>
        ) : initialCategories.length === 0 ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            No categories found. Run <code>npm run seed</code> to create the default catalogue.
          </p>
        ) : (
          <AdminProductsManager
            initialProducts={initialProducts}
            initialCategories={initialCategories}
          />
        )}
      </div>
    </PortalPage>
  );
}
