import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { SEED_PACKAGING } from "@/lib/content/seed-catalog";

export type PackagingItem = {
  slug: string;
  name: string;
  mode: "dry" | "liquid" | "unpackaged";
  description: string;
  advantages: string[];
};

function fromSeed(): PackagingItem[] {
  return SEED_PACKAGING.map((p) => ({
    slug: p.slug,
    name: p.name,
    mode: p.mode,
    description: p.description,
    advantages: "advantages" in p && Array.isArray(p.advantages) ? (p.advantages as string[]) : [],
  }));
}

/** Active packaging types — Mongo when configured, else seed catalogue. */
export async function getPackagingCatalog(): Promise<PackagingItem[]> {
  if (!isMongoConfigured()) return fromSeed();
  const conn = await tryConnectMongo();
  if (!conn) return fromSeed();

  const { PackagingType } = await import("@/models");
  const docs = await PackagingType.find({ status: "active", deletedAt: null })
    .sort({ displayOrder: 1, name: 1 })
    .lean();

  if (docs.length === 0) return fromSeed();

  return docs.map((d) => ({
    slug: d.slug,
    name: d.name,
    mode: d.mode,
    description: d.description ?? "",
    advantages: d.advantages ?? [],
  }));
}

export function getPackagingSync() {
  return fromSeed();
}
