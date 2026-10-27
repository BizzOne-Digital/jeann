import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { writeAuditEvent } from "@/lib/audit/log";
import { INTERNAL_ROLE_KEYS, isPermission } from "@/lib/admin/employee-access";
import {
  applyModuleChange,
  CEO_ONLY_PERMISSIONS,
  EMPLOYEE_MODULE_KEYS,
} from "@/lib/authorization/modules";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ userId: string }> };

const patchSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("set_roles"), roles: z.array(z.enum(INTERNAL_ROLE_KEYS)).min(1) }),
  z.object({ action: z.literal("add_module"), module: z.enum(EMPLOYEE_MODULE_KEYS as [string, ...string[]]) }),
  z.object({ action: z.literal("remove_module"), module: z.enum(EMPLOYEE_MODULE_KEYS as [string, ...string[]]) }),
  z.object({ action: z.literal("grant"), permission: z.string() }),
  z.object({ action: z.literal("deny"), permission: z.string() }),
  z.object({ action: z.literal("clear_override"), permission: z.string() }),
  z.object({ action: z.enum(["suspend", "reactivate"]) }),
]);

async function loadTarget(userId: string) {
  const { Organization, OrganizationMembership, User } = await import("@/models");
  const orgs = await Organization.find({ type: "internal", deletedAt: null }).select("_id").lean();
  const membership = await OrganizationMembership.findOne({
    userId: new Types.ObjectId(userId),
    organizationId: { $in: orgs.map((o) => o._id) },
    deletedAt: null,
  });
  const user = membership ? await User.findOne({ _id: userId, deletedAt: null }) : null;
  return { membership, user };
}

/** CEO / General Manager: change roles, grant/deny permissions, add/remove modules, suspend. */
export async function PATCH(request: NextRequest, context: Ctx) {
  try {
    const auth = await requireApiAuth({ permissions: ["users:write", "roles:manage"] });
    if ("error" in auth) return auth.error;
    const { userId } = await context.params;
    if (!Types.ObjectId.isValid(userId)) return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    if (userId === auth.ctx.userId) {
      return NextResponse.json({ error: "You cannot change your own access." }, { status: 403 });
    }
    const parsed = patchSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 422 });
    const body = parsed.data;

    const actorIsCeo = auth.ctx.memberships.some((m) => m.roles.includes("ceo_super_admin"));
    const { membership, user } = await loadTarget(userId);
    if (!membership || !user) return NextResponse.json({ error: "Employee not found." }, { status: 404 });
    if (membership.roles.includes("ceo_super_admin") && !actorIsCeo) {
      return NextResponse.json({ error: "Only the CEO can modify a CEO account." }, { status: 403 });
    }

    let custom: string[] = [...(membership.customPermissions ?? [])];
    let denied: string[] = [...(membership.deniedPermissions ?? [])];

    switch (body.action) {
      case "set_roles":
        if (body.roles.includes("ceo_super_admin") && !actorIsCeo) {
          return NextResponse.json({ error: "Only the CEO can assign the CEO role." }, { status: 403 });
        }
        membership.roles = [...body.roles];
        break;
      case "add_module":
      case "remove_module": {
        const next = applyModuleChange({ custom, denied }, body.module as never, body.action === "add_module" ? "add" : "remove");
        custom = next.custom;
        denied = next.denied;
        break;
      }
      case "grant":
      case "deny":
      case "clear_override": {
        if (!isPermission(body.permission)) return NextResponse.json({ error: "Unknown permission." }, { status: 422 });
        if (body.action === "grant" && !actorIsCeo && CEO_ONLY_PERMISSIONS.includes(body.permission)) {
          return NextResponse.json({ error: "Only the CEO can grant this permission." }, { status: 403 });
        }
        custom = custom.filter((p) => p !== body.permission);
        denied = denied.filter((p) => p !== body.permission);
        if (body.action === "grant") custom.push(body.permission);
        if (body.action === "deny") denied.push(body.permission);
        break;
      }
      case "suspend":
        user.status = "suspended";
        membership.status = "suspended";
        break;
      case "reactivate":
        user.status = "active";
        membership.status = "active";
        break;
    }

    membership.customPermissions = custom as never;
    membership.deniedPermissions = denied as never;
    await membership.save();
    await user.save();

    if (body.action === "suspend") {
      const { Session } = await import("@/models");
      await Session.updateMany({ userId: user._id, revokedAt: null }, { $set: { revokedAt: new Date() } });
    }

    await writeAuditEvent({
      action: `employee.${body.action}`,
      targetType: "user",
      targetId: userId,
      actorUserId: auth.ctx.userId,
      result: "success",
      metadata: { detail: body as unknown as Record<string, unknown> },
    });
    return NextResponse.json({
      ok: true,
      roles: membership.roles,
      customPermissions: custom,
      deniedPermissions: denied,
      status: user.status,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/** CEO / General Manager: delete (soft-delete) an employee account and revoke sessions. */
export async function DELETE(_request: NextRequest, context: Ctx) {
  try {
    const auth = await requireApiAuth({ permissions: ["users:write", "users:disable"] });
    if ("error" in auth) return auth.error;
    const { userId } = await context.params;
    if (!Types.ObjectId.isValid(userId)) return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    if (userId === auth.ctx.userId) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 403 });
    }
    const actorIsCeo = auth.ctx.memberships.some((m) => m.roles.includes("ceo_super_admin"));
    const { membership, user } = await loadTarget(userId);
    if (!membership || !user) return NextResponse.json({ error: "Employee not found." }, { status: 404 });
    if (membership.roles.includes("ceo_super_admin") && !actorIsCeo) {
      return NextResponse.json({ error: "Only the CEO can delete a CEO account." }, { status: 403 });
    }

    const now = new Date();
    membership.deletedAt = now;
    membership.status = "removed";
    await membership.save();
    user.deletedAt = now;
    user.status = "disabled";
    await user.save();
    const { Session } = await import("@/models");
    await Session.updateMany({ userId: user._id, revokedAt: null }, { $set: { revokedAt: now } });

    await writeAuditEvent({
      action: "employee.deleted",
      targetType: "user",
      targetId: userId,
      actorUserId: auth.ctx.userId,
      result: "success",
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
