import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";

export const runtime = "nodejs";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** One line of "Label: value" text for each field of a specification. */
function specificationText(fields: Record<string, unknown> | undefined): string {
  if (!fields) return "";
  return Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => k.replace(/_/g, " ") + ": " + String(v))
    .join("\n");
}

/**
 * Product search for the buyer's order form. Returns published products only, with the active
 * specification. The internal price is never returned.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;
    await assertBuyerTransactionAccess(auth.ctx.userId);

    const q = (request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 80);
    const { Product, ProductSpecificationVersion, PackagingType } = await import("@/models");

    const filter: Record<string, unknown> = { status: "published", deletedAt: null };
    if (q) filter.name = { $regex: escapeRegex(q), $options: "i" };
    const products = await Product.find(filter)
      .select("name slug code gradeSummary originOptions incotermOptions packagingOptionIds categoryId")
      .sort({ displayOrder: 1, name: 1 })
      .limit(20)
      .lean();

    const ids = products.map((p) => p._id);
    const specs = await ProductSpecificationVersion.find({ productId: { $in: ids }, active: true })
      .sort({ version: -1 })
      .lean();
    const specByProduct = new Map<string, (typeof specs)[number]>();
    for (const s of specs) if (!specByProduct.has(String(s.productId))) specByProduct.set(String(s.productId), s);

    const packagingIds = [...new Set(products.flatMap((p) => (p.packagingOptionIds ?? []).map(String)))];
    const packaging = await PackagingType.find({ _id: { $in: packagingIds }, status: "active", deletedAt: null })
      .select("name")
      .lean();
    const packagingName = new Map(packaging.map((p) => [String(p._id), p.name]));

    return NextResponse.json({
      items: products.map((p) => {
        const spec = specByProduct.get(String(p._id));
        return {
          id: String(p._id),
          name: p.name,
          slug: p.slug,
          code: p.code,
          categoryId: p.categoryId ? String(p.categoryId) : undefined,
          grade: p.gradeSummary,
          origins: p.originOptions ?? [],
          incoterms: p.incotermOptions ?? [],
          packaging: (p.packagingOptionIds ?? []).map((id: unknown) => packagingName.get(String(id))).filter(Boolean),
          specificationVersionId: spec ? String(spec._id) : undefined,
          specificationName: spec?.specificationName,
          specification: specificationText(spec?.fields as Record<string, unknown> | undefined),
        };
      }),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
