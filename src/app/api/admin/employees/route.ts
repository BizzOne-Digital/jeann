import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { hashPassword } from "@/lib/auth/password";
import { splitName } from "@/lib/auth/auth-context";
import { writeAuditEvent } from "@/lib/audit/log";
import { listInternalEmployees } from "@/lib/admin/list-employees";
import { INTERNAL_ROLE_KEYS } from "@/lib/admin/employee-access";

export const runtime = "nodejs";

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  /** Temporary password; the employee should change it after first login. */
  password: z.string().min(12).max(128),
  roles: z.array(z.enum(INTERNAL_ROLE_KEYS)).min(1),
});

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "users:read" });
    if ("error" in auth) return auth.error;
    return NextResponse.json({ items: await listInternalEmployees() });
  } catch (error) {
    return handleApiError(error);
  }
}

/** CEO / General Manager: create an employee account. */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: ["users:write", "roles:manage"] });
    if ("error" in auth) return auth.error;

    const parsed = createSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid employee data." }, { status: 422 });
    }
    const { name, email, password, roles } = parsed.data;
    const actorIsCeo = auth.ctx.memberships.some((m) => m.roles.includes("ceo_super_admin"));
    if (roles.includes("ceo_super_admin") && !actorIsCeo) {
      return NextResponse.json({ error: "Only the CEO can assign the CEO role." }, { status: 403 });
    }

    const { User, Organization, OrganizationMembership } = await import("@/models");
    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail, deletedAt: null }).lean();
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    const org = await Organization.findOne({ type: "internal", deletedAt: null });
    if (!org) {
      return NextResponse.json({ error: "Internal organization not found." }, { status: 409 });
    }

    const { firstName, lastName } = splitName(name);
    const user = await User.create({
      email: normalizedEmail,
      normalizedEmail,
      passwordHash: await hashPassword(password),
      firstName,
      lastName,
      name,
      status: "active",
      emailVerifiedAt: new Date(),
    });
    await OrganizationMembership.create({
      userId: user._id,
      organizationId: org._id,
      roles,
      customPermissions: [],
      deniedPermissions: [],
      status: "active",
      invitedBy: auth.ctx.userId,
    });

    await writeAuditEvent({
      action: "employee.created",
      targetType: "user",
      targetId: String(user._id),
      actorUserId: auth.ctx.userId,
      result: "success",
      metadata: { roles },
    });
    return NextResponse.json({ id: String(user._id) }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
