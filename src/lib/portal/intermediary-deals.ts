import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { notifyAdmins } from "@/lib/notifications/service";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { createIntermediaryDocument } from "@/lib/portal/intermediary-document";

/**
 * Agents and brokers are two separate portals with different responsibilities:
 * - agent: acts strictly for one principal (the end buyer) and passes documents between Finekarts and that buyer.
 * - broker: neutral; introduces both the buyer and the supplier and is not a party to the contract.
 * In both cases the end buyer signs, never the intermediary.
 */
export type IntermediaryKind = "agent" | "broker";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXT = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];

const ROLES: Record<IntermediaryKind, string[]> = {
  agent: ["agent_org_admin", "agent_member"],
  broker: ["broker_org_admin", "broker_member"],
};

const metaSchema = z.object({
  buyerCompanyName: z.string().trim().min(2).max(200),
  buyerContactName: z.string().trim().max(120).optional(),
  buyerEmail: z.string().trim().email().max(254).optional().or(z.literal("")),
  buyerPhone: z.string().trim().max(40).optional(),
  buyerCountry: z.string().trim().max(120).optional(),
  supplierCompanyName: z.string().trim().max(200).optional(),
  supplierContactName: z.string().trim().max(120).optional(),
  productName: z.string().trim().min(2).max(200),
  quantity: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(4000).optional(),
  documentType: z.enum(["loi", "icpo"]),
});

type MembershipLike = { organizationId: string; roles: string[]; status: string };

function organizationIdFor(kind: IntermediaryKind, ctx: { memberships: MembershipLike[] }) {
  const m = ctx.memberships.find(
    (x) => x.status === "active" && x.roles.some((r) => ROLES[kind].includes(r)),
  );
  return m?.organizationId ?? null;
}

export async function listIntermediaryDeals(kind: IntermediaryKind) {
  try {
    const auth = await requireApiAuth({ permissions: `${kind}:access` });
    if ("error" in auth) return auth.error;
    const orgId = organizationIdFor(kind, auth.ctx);
    if (!orgId) return NextResponse.json({ error: `No ${kind} organization.` }, { status: 403 });

    await tryConnectMongo();
    const { AgentDeal } = await import("@/models");
    const items = await AgentDeal.find({ agentOrganizationId: orgId, channel: kind })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return NextResponse.json({
      items: items.map((d) => ({
        id: String(d._id),
        reference: d.reference,
        buyerCompanyName: d.buyerCompanyName,
        supplierCompanyName: d.supplierCompanyName ?? "",
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

export async function submitIntermediaryDeal(request: NextRequest, kind: IntermediaryKind) {
  try {
    const auth = await requireApiAuth({ permissions: `${kind}:access` });
    if ("error" in auth) return auth.error;
    const orgId = organizationIdFor(kind, auth.ctx);
    if (!orgId) return NextResponse.json({ error: `No ${kind} organization.` }, { status: 403 });

    const form = await request.formData();
    // "upload": post the LOI or ICPO received from the end buyer. "create": prepare a new one in the portal.
    const mode = form.get("mode") === "create" ? "create" : "upload";
    const file = form.get("file");
    if (mode === "upload") {
      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json({ error: "Attach the buyer's LOI or ICPO file, or choose to create a new one." }, { status: 422 });
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: "File is too large (10 MB maximum)." }, { status: 413 });
      }
      const lower = file.name.toLowerCase();
      if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
        return NextResponse.json({ error: "Upload a PDF, Word document or image." }, { status: 422 });
      }
    }

    const parsed = metaSchema.safeParse(
      Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string")),
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please complete the buyer company, product and document type." },
        { status: 422 },
      );
    }
    const data = parsed.data;
    if (kind === "broker" && !data.supplierCompanyName?.trim()) {
      return NextResponse.json(
        { error: "A broker introduces both sides. Enter the supplier company as well." },
        { status: 422 },
      );
    }

    await tryConnectMongo();
    const { AgentDeal } = await import("@/models");
    const prefix = kind === "agent" ? "AGD" : "BRD";
    const reference = `${prefix}-${nanoid(8).toUpperCase().replace(/[^A-Z0-9]/g, "X")}`;
    let stored: { filename: string; mimeType: string; size: number; bytes: Buffer };
    if (mode === "create") {
      const made = await createIntermediaryDocument({
        documentType: data.documentType,
        buyerCompanyName: data.buyerCompanyName,
        productName: data.productName,
        quantity: data.quantity,
        reference,
      });
      stored = { filename: made.filename, mimeType: "application/pdf", size: made.bytes.length, bytes: Buffer.from(made.bytes) };
    } else {
      const upload = file as File;
      stored = {
        filename: upload.name.slice(0, 255),
        mimeType: upload.type || "application/octet-stream",
        size: upload.size,
        bytes: Buffer.from(await upload.arrayBuffer()),
      };
    }
    const doc = await AgentDeal.create({
      reference,
      channel: kind,
      agentOrganizationId: orgId,
      submittedByUserId: auth.ctx.userId,
      ...data,
      buyerEmail: data.buyerEmail || undefined,
      supplierCompanyName: kind === "broker" ? data.supplierCompanyName : undefined,
      supplierContactName: kind === "broker" ? data.supplierContactName : undefined,
      filename: stored.filename,
      mimeType: stored.mimeType,
      size: stored.size,
      fileData: stored.bytes,
      source: mode === "create" ? "created" : "uploaded",
    });

    const meta = auditRequestMeta(request);
    await writeAuditEvent({
      action: `${kind}_deal.submitted`,
      targetType: "agent_deal",
      targetId: doc._id,
      actorUserId: auth.ctx.userId,
      organizationId: orgId,
      ...meta,
      metadata: { reference, documentType: data.documentType, source: mode },
    });
    await notifyAdmins({
      type: `${kind}_deal_submitted`,
      title: `New ${kind} submission`,
      body: `${reference}: a ${kind} submitted a ${data.documentType.toUpperCase()} for ${data.buyerCompanyName}.`,
      href: `/admin/${kind}-deals`,
    });

    return NextResponse.json({ ok: true, id: String(doc._id), reference });
  } catch (error) {
    return handleApiError(error);
  }
}
