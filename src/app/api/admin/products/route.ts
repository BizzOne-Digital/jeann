import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import {
  productInputToMongo,
  adminProductSchema,
} from "@/lib/admin/product-validation";
import {
  serializeCategory,
  serializeProduct,
} from "@/lib/admin/product-serializer";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const runtime = "nodejs";

const defaultClaims = {
  certified: { enabled: false, note: "" },
  inStock: { enabled: false, note: "" },
  readyToShip: { enabled: false, note: "" },
  specificOrigin: { enabled: false, note: "" },
};

export async function GET() {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  try {
    const { Product, ProductCategory } = await import("@/models");
    const [products, categories] = await Promise.all([
      Product.find({ deletedAt: null }).sort({ displayOrder: 1, name: 1 }).lean(),
      ProductCategory.find({ deletedAt: null }).sort({ displayOrder: 1, name: 1 }).lean(),
    ]);

    const categoryById = new Map(categories.map((category) => [String(category._id), category]));

    return NextResponse.json({
      products: products.map((product) =>
        serializeProduct(product, categoryById.get(String(product.categoryId))),
      ),
      categories: categories.map(serializeCategory),
    });
  } catch (error) {
    console.error("[admin/products GET]", error);
    return NextResponse.json({ error: "Unable to load products." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = adminProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  if (!Types.ObjectId.isValid(parsed.data.categoryId)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 422 });
  }

  try {
    const { Product, ProductCategory } = await import("@/models");
    const category = await ProductCategory.findOne({
      _id: parsed.data.categoryId,
      deletedAt: null,
    }).lean();
    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    const payload = productInputToMongo(parsed.data);
    const doc = await Product.findOneAndUpdate(
      { slug: payload.slug },
      {
        $set: payload,
        $setOnInsert: {
          packagingOptionIds: [],
          documentCategories: [],
          claims: defaultClaims,
          requiresAdminVerification: true,
        },
      },
      { upsert: true, new: true },
    ).lean();

    return NextResponse.json({
      ok: true,
      product: serializeProduct(doc, category),
    });
  } catch (error) {
    console.error("[admin/products POST]", error);
    return NextResponse.json({ error: "Unable to save product." }, { status: 500 });
  }
}
