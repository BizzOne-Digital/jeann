import { NextResponse } from "next/server";
import { adminDeniedResponse, requireAdminApiSession } from "@/lib/admin/require-admin-api";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await requireAdminApiSession())) return adminDeniedResponse();
  const { AgentDeal, Organization } = await import("@/models");
  const channel = new URL(request.url).searchParams.get("channel") === "broker" ? "broker" : "agent";
  const filter = channel === "agent" ? { channel: { $ne: "broker" } } : { channel };
  const items = await AgentDeal.find(filter).sort({ createdAt: -1 }).limit(300).lean();
  const orgs = await Organization.find({ _id: { $in: items.map((d) => d.agentOrganizationId) } })
    .select("legalName")
    .lean();
  const names = new Map(orgs.map((o) => [String(o._id), o.legalName]));
  return NextResponse.json({
    items: items.map((d) => ({
      id: String(d._id),
      reference: d.reference,
      agent: names.get(String(d.agentOrganizationId)) ?? "Agent",
      buyerCompanyName: d.buyerCompanyName,
      supplierCompanyName: d.supplierCompanyName ?? "",
      buyerContactName: d.buyerContactName ?? "",
      buyerEmail: d.buyerEmail ?? "",
      buyerPhone: d.buyerPhone ?? "",
      buyerCountry: d.buyerCountry ?? "",
      productName: d.productName,
      quantity: d.quantity ?? "",
      notes: d.notes ?? "",
      documentType: d.documentType,
      filename: d.filename,
      status: d.status,
      staffNotes: d.staffNotes ?? "",
      createdAt: d.createdAt,
    })),
  });
}
