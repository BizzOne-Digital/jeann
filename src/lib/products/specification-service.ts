import { Types } from "mongoose";

/** "Label: value" lines to specification fields. A line without a colon is kept as a note. */
export function parseSpecificationText(text: string): Record<string, string> {
  const fields: Record<string, string> = {};
  let note = 0;
  for (const raw of text.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const i = line.indexOf(":");
    if (i > 0 && i < 80) {
      fields[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    } else {
      note += 1;
      fields["Note " + note] = line;
    }
  }
  return fields;
}

export function specificationFieldsToText(fields: Record<string, unknown> | undefined): string {
  if (!fields) return "";
  return Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => (/^Note \d+$/.test(k) ? String(v) : k + ": " + String(v)))
    .join("\n");
}

/** The text of the active specification of a product, or an empty string. */
export async function loadActiveSpecificationText(productId: unknown): Promise<string> {
  const { ProductSpecificationVersion } = await import("@/models");
  const spec = await ProductSpecificationVersion.findOne({ productId, active: true })
    .sort({ version: -1 })
    .lean();
  return specificationFieldsToText(spec?.fields as Record<string, unknown> | undefined);
}

/**
 * Saves the specification text as a new active version. Older versions stay on record, so earlier
 * orders keep the specification they were made with. Nothing changes when the text is unchanged.
 */
export async function saveProductSpecification(input: {
  productId: unknown;
  productName: string;
  categoryId?: unknown;
  text: string;
  userId?: string;
}) {
  const { ProductSpecificationVersion } = await import("@/models");
  const fields = parseSpecificationText(input.text);
  const current = await ProductSpecificationVersion.findOne({ productId: input.productId })
    .sort({ version: -1 })
    .lean();
  const same =
    current?.active && JSON.stringify(current.fields ?? {}) === JSON.stringify(fields);
  if (same) return { changed: false as const };
  if (Object.keys(fields).length === 0 && !current) return { changed: false as const };

  await ProductSpecificationVersion.updateMany({ productId: input.productId, active: true }, { $set: { active: false } });
  if (Object.keys(fields).length === 0) return { changed: true as const, version: current?.version ?? 0 };
  const version = (current?.version ?? 0) + 1;
  await ProductSpecificationVersion.create({
    productId: input.productId,
    categoryId: input.categoryId,
    specificationName: input.productName + " specification v" + version,
    version,
    fields,
    active: true,
    approvedByUserId: input.userId && Types.ObjectId.isValid(input.userId) ? new Types.ObjectId(input.userId) : undefined,
    approvedAt: new Date(),
  });
  return { changed: true as const, version };
}
