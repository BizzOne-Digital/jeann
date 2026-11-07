import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { notifyAdmins } from "@/lib/notifications/service";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXT = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];

const metaSchema = z.object({
  buyerCompanyName: z.string().trim().min(2).max(200),
  buyerContactName: z.string().trim().max(120).optional(),
  buyerEmail: z.string().trim().email().max(254).optional().or(z.literal("")),
  buyerPhone: z.string().trim().max(40).optional(),
  buyerCountry: z.string().trim().max(120).optional(),
  productName: z.string().trim().min(2).max(200),
  quantity: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(4000).optional(),
  documentType: z.enum(["loi", "icpo"]),
});

function agentOrganizationId(ctx: { memberships: Array<{ organizationId: string; roles: string[]; status: string }> }) {
  const m = ctx.memberships.find(
    (x) => x.status === "active" && x.roles.some((r) => r === "agent_org_admin" || r === "agent_member"),
  );
  return m?.organizationId ?? null;
}

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "agent:access" });
    if ("error" in auth) return auth.error;
    const orgId = agentOrganizationId(auth.ctx);
    if (!orgId) return NextResponse.json({ error: "No agent organization." }, { status: 403 });

    await tryConnectMongo();
    const { AgentDeal } = await import("@/models");
    const items = await AgentDeal.find({ agentOrganizationId: orgId }).sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json({
      items: items.map((d) => ({
        id: String(d._id),
        reference: d.reference,
        buyerCompanyName: d.buyerCompanyName,
        productName: d.productName,
        documentType: d.documentType,
        filename: d.filename,
        status: d.status,
        createdAt: d.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "agent:access" });
    if ("error" in auth) return auth.error;
    const orgId = agentOrganizationId(auth.ctx);
    if (!orgId) return NextResponse.json({ error: "No agent organization." }, { status: 403 });

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Attach the buyer's LOI or ICPO file." }, { status: 422 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File is too large (10 MB maximum)." }, { status: 413 });
    }
    const lower = file.name.toLowerCase();
    if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
      return NextResponse.json({ error: "Upload a PDF, Word document or image." }, { status: 422 });
    }

    const parsed = metaSchema.safeParse(Object.fromEntries(
      [...form.entries()].filter(([, v]) => typeof v === "string"),
    ));
    if (!parsed.success) {
      return NextResponse.json({ error: "Please complete the buyer company, product and document type." }, { status: 422 });
    }
    const data = parsed.data;

    await tryConnectMongo();
    const { AgentDeal } = await import("@/models");
    const reference = `AGD-${nanoid(8).toUpperCase().replace(/[^A-Z0-9]/g, "X")}`;
    const doc = await AgentDeal.create({
      reference,
      agentOrganizationId: orgId,
      submittedByUserId: auth.ctx.userId,
      ...data,
      buyerEmail: data.buyerEmail || undefined,
      filename: file.name.slice(0, 255),
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      fileData: Buffer.from(await file.arrayBuffer()),
    });

    const meta = auditRequestMeta(request);
    await writeAuditEvent({
      action: "agent_deal.submitted",
      targetType: "agent_deal",
      targetId: doc._id,
      actorUserId: auth.ctx.userId,
      organizationId: orgId,
      ...meta,
      metadata: { reference, documentType: data.documentType },
    });
    await notifyAdmins({
      type: "agent_deal_submitted",
      title: "New agent submission",
      body: `${reference}: an agent submitted a ${data.documentType.toUpperCase()} for ${data.buyerCompanyName}.`,
      href: "/admin/agent-deals",
    });

    return NextResponse.json({ ok: true, id: String(doc._id), reference });
  } catch (error) {
    return handleApiError(error);
  }
}
