import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { serializeBuyerDetail, loadBuyerDetail } from "@/lib/admin/buyer-approval";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  try {
    const { Organization, OrganizationMembership, User } = await import("@/models");
    const orgs = await Organization.find({ type: "buyer", deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const orgIds = orgs.map((org) => org._id);
    const memberships = await OrganizationMembership.find({
      organizationId: { $in: orgIds },
      deletedAt: null,
      roles: { $in: ["buyer_org_admin", "buyer_member"] },
    }).lean();

    const userIds = memberships.map((m) => m.userId);
    const users = await User.find({ _id: { $in: userIds }, deletedAt: null }).lean();
    const userById = new Map(users.map((u) => [String(u._id), u]));
    const membershipByOrg = new Map(
      memberships.map((m) => [String(m.organizationId), m]),
    );

    return NextResponse.json({
      items: orgs.map((org) => {
        const membership = membershipByOrg.get(String(org._id));
        const contact = membership ? userById.get(String(membership.userId)) : null;
        return {
          _id: String(org._id),
          legalName: org.legalName,
          country: org.country,
          status: org.status,
          createdAt: org.createdAt ? new Date(org.createdAt).toLocaleDateString() : null,
          contactEmail: contact?.email ?? "",
          contactName: contact?.name ?? "",
        };
      }),
    });
  } catch (error) {
    console.error("[admin/buyers GET]", error);
    return NextResponse.json({ error: "Unable to load buyers." }, { status: 500 });
  }
}
