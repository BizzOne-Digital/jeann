import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "users:read" });
    if ("error" in auth) return auth.error;

    const status = request.nextUrl.searchParams.get("status");
    const { User } = await import("@/models");
    const filter: Record<string, unknown> = { deletedAt: null };
    if (status) filter.status = status;

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .select("-passwordHash")
      .lean();

    const { OrganizationMembership } = await import("@/models");
    const memberships = await OrganizationMembership.find({
      userId: { $in: users.map((u) => u._id) },
      deletedAt: null,
    }).lean();

    return NextResponse.json({
      items: users.map((u) => ({
        id: String(u._id),
        email: u.email,
        name: u.name,
        firstName: u.firstName,
        lastName: u.lastName,
        status: u.status,
        emailVerified: Boolean(u.emailVerifiedAt),
        phoneVerified: Boolean(u.phoneVerifiedAt),
        lastLoginAt: u.lastLoginAt,
        memberships: memberships
          .filter((m) => String(m.userId) === String(u._id))
          .map((m) => ({
            organizationId: String(m.organizationId),
            roles: m.roles,
            status: m.status,
          })),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
