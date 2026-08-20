import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import {
  productInputToMongo,
  adminProductSchema,
} from "@/lib/admin/product-validation";
import { serializeProduct } from "@/lib/admin/product-serializer";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  const { slug } = await context.params;

  try {
    const { Product, ProductCategory } = await import("@/models");
    const product = await Product.findOne({ slug, deletedAt: null }).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    const category = await ProductCategory.findById(product.categoryId).lean();
    return NextResponse.json({ product: serializeProduct(product, category) });
  } catch (error) {
    console.error("[admin/products/:slug GET]", error);
    return NextResponse.json({ error: "Unable to load product." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  const { slug } = await context.params;

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

  if (parsed.data.slug !== slug) {
    return NextResponse.json({ error: "Slug in URL must match body." }, { status: 422 });
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

    const product = await Product.findOneAndUpdate(
      { slug, deletedAt: null },
      { $set: productInputToMongo(parsed.data) },
      { new: true },
    ).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, product: serializeProduct(product, category) });
  } catch (error) {
    console.error("[admin/products/:slug PUT]", error);
    return NextResponse.json({ error: "Unable to update product." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  const { slug } = await context.params;

  try {
    const { Product } = await import("@/models");
    const result = await Product.updateOne(
      { slug, deletedAt: null },
      { $set: { status: "archived", deletedAt: new Date() } },
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/products/:slug DELETE]", error);
    return NextResponse.json({ error: "Unable to delete product." }, { status: 500 });
  }
}
