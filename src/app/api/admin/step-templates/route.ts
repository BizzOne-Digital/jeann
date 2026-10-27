import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { writeAuditEvent } from "@/lib/audit/log";

export const runtime = "nodejs";

const keyRe = /^[a-z0-9_]{2,64}$/;

const docSchema = z.object({
  kind: z.literal("document"),
  key: z.string().regex(keyRe),
  name: z.string().min(1).max(200),
  side: z.enum(["buyer", "supplier"]),
  status: z.enum(["draft", "published", "archived"]),
  bodyBlocks: z
    .array(z.object({ type: z.string().min(1).max(40), content: z.string().min(1).max(20000) }))
    .max(100),
});

const wfSchema = z.object({
  kind: z.literal("workflow"),
  key: z.string().regex(keyRe),
  name: z.string().min(1).max(200),
  side: z.enum(["buyer", "supplier"]),
  active: z.boolean().default(true),
  steps: z
    .array(
      z.object({
        key: z.string().regex(keyRe),
        title: z.string().min(1).max(200),
        description: z.string().max(2000).optional(),
        required: z.boolean().default(true),
        ownerRole: z.string().max(80).optional(),
      }),
    )
    .min(1)
    .max(20),
});

async function latestOnly<T extends { key: string; version: number }>(rows: T[]): Promise<T[]> {
  const seen = new Map<string, T>();
  for (const r of rows) if (!seen.has(r.key)) seen.set(r.key, r);
  return [...seen.values()];
}

export async function GET() {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { DocumentTemplate, WorkflowTemplate } = await import("@/models");
  const docs = await DocumentTemplate.find().sort({ key: 1, version: -1 }).lean();
  const wfs = await WorkflowTemplate.find().sort({ key: 1, version: -1 }).lean();
  return NextResponse.json({
    documentTemplates: await latestOnly(docs),
    workflowTemplates: await latestOnly(wfs),
  });
}

/** Saves a NEW version of a template (older versions are kept; existing transactions keep what they started with). */
export async function PUT(request: NextRequest) {
  const session = await requireAdminApiSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const { DocumentTemplate, WorkflowTemplate } = await import("@/models");

  const doc = docSchema.safeParse(raw);
  if (doc.success) {
    const d = doc.data;
    const last = await DocumentTemplate.findOne({ key: d.key }).sort({ version: -1 }).lean();
    const version = (last?.version ?? 0) + 1;
    await DocumentTemplate.create({
      key: d.key,
      name: d.name,
      side: d.side,
      status: d.status,
      version,
      bodyBlocks: d.bodyBlocks.map((b, i) => ({ ...b, order: i })),
    });
    await writeAuditEvent({
      action: "template.document_saved",
      targetType: "document_template",
      targetId: `${d.key}@${version}`,
      actorUserId: session.userId,
      metadata: { blocks: d.bodyBlocks.length, status: d.status, previousVersion: last?.version ?? null },
    });
    return NextResponse.json({ ok: true, version });
  }

  const wf = wfSchema.safeParse(raw);
  if (wf.success) {
    const w = wf.data;
    const keys = w.steps.map((s) => s.key);
    if (new Set(keys).size !== keys.length) {
      return NextResponse.json({ error: "Step keys must be unique." }, { status: 422 });
    }
    const last = await WorkflowTemplate.findOne({ key: w.key }).sort({ version: -1 }).lean();
    const version = (last?.version ?? 0) + 1;
    await WorkflowTemplate.create({
      key: w.key,
      name: w.name,
      side: w.side,
      active: w.active,
      version,
      steps: w.steps.map((s, i) => ({ ...s, order: i + 1 })),
    });
    await writeAuditEvent({
      action: "template.workflow_saved",
      targetType: "workflow_template",
      targetId: `${w.key}@${version}`,
      actorUserId: session.userId,
      metadata: { steps: keys, previousVersion: last?.version ?? null },
    });
    return NextResponse.json({ ok: true, version });
  }

  return NextResponse.json({ error: "Invalid input." }, { status: 422 });
}

/** Removes a template by archiving (document) or deactivating (workflow) all its versions. */
export async function DELETE(request: NextRequest) {
  const session = await requireAdminApiSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const kind = request.nextUrl.searchParams.get("kind");
  const key = request.nextUrl.searchParams.get("key") ?? "";
  if (!keyRe.test(key) || (kind !== "document" && kind !== "workflow")) {
    return NextResponse.json({ error: "Invalid input." }, { status: 422 });
  }
  const { DocumentTemplate, WorkflowTemplate } = await import("@/models");
  if (kind === "document") {
    await DocumentTemplate.updateMany({ key }, { $set: { status: "archived" } });
  } else {
    await WorkflowTemplate.updateMany({ key }, { $set: { active: false } });
  }
  await writeAuditEvent({
    action: `template.${kind}_removed`,
    targetType: `${kind}_template`,
    targetId: key,
    actorUserId: session.userId,
  });
  return NextResponse.json({ ok: true });
}
