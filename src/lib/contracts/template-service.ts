import { writeAuditEvent } from "@/lib/audit/log";
import { defaultTemplates } from "@/lib/contracts/default-templates";
import { templateKeyFor, templateSlugForDocumentType, type ContractSide } from "@/lib/contracts/contract-flow";
import type { TemplateBlock } from "@/lib/contracts/template-merge";

/** Creates default templates only where no version exists for the key. Idempotent. */
export async function seedMissingDefaultTemplates(actorUserId?: string) {
  const { DocumentTemplate } = await import("@/models");
  const created: string[] = [];
  const skipped: string[] = [];
  for (const t of defaultTemplates()) {
    if (await DocumentTemplate.exists({ key: t.key })) {
      skipped.push(t.key);
      continue;
    }
    await DocumentTemplate.create({
      key: t.key,
      name: t.name,
      side: t.side,
      status: t.status,
      version: 1,
      bodyBlocks: t.bodyBlocks.map((b, i) => ({ ...b, order: i })),
    });
    created.push(t.key);
  }
  await writeAuditEvent({
    action: "template.defaults_seeded",
    targetType: "document_template",
    actorUserId,
    metadata: { created, skippedCount: skipped.length },
  });
  return { created, skipped };
}

/** Latest version's body if that version is published, else null (callers fall back to built-in content). */
export async function findPublishedTemplate(
  documentType: string | undefined | null,
  side: ContractSide,
): Promise<{ key: string; version: number; bodyBlocks: TemplateBlock[] } | null> {
  const slug = templateSlugForDocumentType(documentType);
  if (!slug) return null;
  const { DocumentTemplate } = await import("@/models");
  const latest = await DocumentTemplate.findOne({ key: templateKeyFor(slug, side) })
    .sort({ version: -1 })
    .lean();
  if (!latest || latest.status !== "published" || !latest.bodyBlocks?.length) return null;
  return { key: latest.key, version: latest.version, bodyBlocks: latest.bodyBlocks };
}
