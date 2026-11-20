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

/**
 * Publishes the client's skeleton as a NEW published version of a template. Older versions stay on
 * record. Admin chose to do this, so it replaces whatever is currently published for that key.
 */
export async function publishClientSkeleton(key: string, actorUserId?: string) {
  const { SCO_SKELETON_BLOCKS } = await import("@/lib/contracts/sco-skeleton");
  const { ICPO_SKELETON_BLOCKS } = await import("@/lib/contracts/icpo-skeleton");
  const { PSA_SKELETON_BLOCKS } = await import("@/lib/contracts/psa-skeleton");
  const { LC_WORDING_SKELETON_BLOCKS } = await import("@/lib/contracts/lc-wording-skeleton");
  const { PROFORMA_SKELETON_BLOCKS } = await import("@/lib/contracts/proforma-skeleton");
  const sup = await import("@/lib/contracts/supplier-skeletons");
  const skeletons: Record<string, { name: string; side: ContractSide; blocks: { type: string; content: string }[] }> = {
    sco_buyer: { name: "Soft Corporate Offer (SCO), client skeleton", side: "buyer", blocks: SCO_SKELETON_BLOCKS },
    icpo_buyer: { name: "ICPO, client skeleton (buyer portal)", side: "buyer", blocks: ICPO_SKELETON_BLOCKS },
    lc_wording_buyer: { name: "Letter of Credit wording (SWIFT MT700), client skeleton", side: "buyer", blocks: LC_WORDING_SKELETON_BLOCKS },
    proforma_invoice_buyer: { name: "Proforma Invoice, client skeleton", side: "buyer", blocks: PROFORMA_SKELETON_BLOCKS },
    spa_buyer: { name: "Sales and Purchase Agreement (PSA), client skeleton", side: "buyer", blocks: PSA_SKELETON_BLOCKS },
    icpo_supplier: { name: "ICPO, client skeleton (supplier portal)", side: "supplier", blocks: sup.SUPPLIER_ICPO_SKELETON_BLOCKS },
    sco_supplier: { name: "Supplier SCO, client skeleton (supplier portal)", side: "supplier", blocks: sup.SUPPLIER_SCO_SKELETON_BLOCKS },
    spa_supplier: { name: "PSA, client skeleton (supplier portal)", side: "supplier", blocks: sup.SUPPLIER_PSA_SKELETON_BLOCKS },
    lc_wording_supplier: { name: "Letter of Credit wording (SWIFT MT700), client skeleton (supplier portal)", side: "supplier", blocks: sup.SUPPLIER_LC_WORDING_SKELETON_BLOCKS },
    proforma_invoice_supplier: { name: "Proforma Invoice, client skeleton (supplier portal)", side: "supplier", blocks: sup.SUPPLIER_PROFORMA_SKELETON_BLOCKS },
  };
  const skeleton = skeletons[key];
  if (!skeleton) throw new Error("unknown_skeleton");
  const { DocumentTemplate } = await import("@/models");
  const latest = await DocumentTemplate.findOne({ key }).sort({ version: -1 }).lean();
  const version = (latest?.version ?? 0) + 1;
  await DocumentTemplate.create({
    key,
    name: skeleton.name,
    side: skeleton.side,
    status: "published",
    version,
    bodyBlocks: skeleton.blocks.map((b, i) => ({ ...b, order: i })),
  });
  await writeAuditEvent({
    action: "template.client_skeleton_published",
    targetType: "document_template",
    actorUserId,
    metadata: { key, version },
  });
  return { key, version };
}

/** Body of the newest PUBLISHED version (a newer draft never switches generation off), else null (callers fall back to built-in content). */
export async function findPublishedTemplate(
  documentType: string | undefined | null,
  side: ContractSide,
): Promise<{ key: string; version: number; bodyBlocks: TemplateBlock[] } | null> {
  const slug = templateSlugForDocumentType(documentType);
  if (!slug) return null;
  const { DocumentTemplate } = await import("@/models");
  const latest = await DocumentTemplate.findOne({
    key: templateKeyFor(slug, side),
    status: "published",
  })
    .sort({ version: -1 })
    .lean();
  if (!latest || !latest.bodyBlocks?.length) return null;
  return { key: latest.key, version: latest.version, bodyBlocks: latest.bodyBlocks };
}
