import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import { findDevUserByEmail } from "@/lib/auth/dev-store";
import { verifyPassword } from "@/lib/auth/password";
import { loginSchema } from "@/lib/validation/auth";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

function portalRedirectForRoles(roles: string[]): string | null {
  if (roles.some((r) => r === "ceo_super_admin" || r === "general_manager")) {
    return "/admin";
  }
  if (
    roles.some((r) =>
      ["trade_manager", "employee_operations", "finance", "compliance_reviewer"].includes(r),
    )
  ) {
    return "/workspace";
  }
  if (roles.some((r) => r.startsWith("supplier_"))) {
    return "/portal/supplier";
  }
  if (roles.includes("banking_advisor")) {
    return "/portal/banking";
  }
  if (roles.some((r) => r === "buyer_org_admin" || r === "buyer_member")) {
    return "/portal/buyer";
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;
    const ua = request.headers.get("user-agent") ?? undefined;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0];

    if (isMongoConfigured()) {
      if (!(await tryConnectMongo())) {
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again shortly." },
          { status: 503 },
        );
      }

      const { User, OrganizationMembership } = await import("@/models");
      const user = await User.findOne({ email, deletedAt: null }).select("+passwordHash");
      if (user?.passwordHash && (await verifyPassword(password, user.passwordHash))) {
        if (user.status !== "active") {
          return NextResponse.json(
            { error: "Your account is not active yet." },
            { status: 403 },
          );
        }

        const membership = await OrganizationMembership.findOne({
          userId: user._id,
          status: "active",
          deletedAt: null,
        }).lean();
        const roles = membership?.roles ?? [];
        const redirectTo = portalRedirectForRoles(roles);
        if (!redirectTo) {
          return NextResponse.json(
            { error: "Your account has no portal access yet. Please contact support." },
            { status: 403 },
          );
        }

        await createSession({ userId: user._id, userAgent: ua, ip });
        return NextResponse.json({ ok: true, redirectTo });
      }

      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const devUser = await findDevUserByEmail(email);
    if (!devUser || !(await verifyPassword(password, devUser.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    if (devUser.status !== "active") {
      return NextResponse.json(
        { error: "Your registration is still under review." },
        { status: 403 },
      );
    }
    await createSession({
      userId: devUser.id,
      userAgent: ua,
      ip,
    });
    const redirectTo =
      devUser.role === "admin"
        ? "/admin"
        : devUser.role === "employee"
          ? "/workspace"
          : `/portal/${devUser.role === "buyer" ? "buyer" : devUser.role}`;
    return NextResponse.json({ ok: true, redirectTo });
  } catch (error) {
    console.error("[login]", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 400 });
  }
}
