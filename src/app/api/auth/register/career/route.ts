import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { splitName } from "@/lib/auth/auth-context";
import { registerCareerApplicantSchema } from "@/lib/validation/auth";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { getOrCreateCareerApplicantOrganization } from "@/lib/careers/applicant-org";
import { getClientIp } from "@/lib/api/request-meta";
import { isSessionConfigError } from "@/lib/auth/session-config";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const ua = request.headers.get("user-agent") ?? undefined;

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = registerCareerApplicantSchema.safeParse(body);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const first =
        flat.fieldErrors.confirmPassword?.[0] ??
        flat.fieldErrors.password?.[0] ??
        flat.fieldErrors.email?.[0] ??
        flat.fieldErrors.acceptPrivacy?.[0];
      return NextResponse.json(
        { error: first ?? "Please correct the highlighted fields.", issues: flat },
        { status: 422 },
      );
    }

    const input = parsed.data;
    const email = input.email.toLowerCase();

    if (!isMongoConfigured() || !(await tryConnectMongo())) {
      return NextResponse.json(
        { error: "Database is unavailable. Please try again shortly." },
        { status: 503 },
      );
    }

    const { User, OrganizationMembership } = await import("@/models");
    const existing = await User.findOne({ email, deletedAt: null });
    if (existing) {
      return NextResponse.json(
        { error: "This email is already registered. Sign in to continue your application." },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(input.password);
    const nameParts = splitName(input.fullName);
    const user = await User.create({
      email,
      normalizedEmail: email,
      passwordHash,
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      name: input.fullName.trim(),
      phone: input.phone.trim(),
      status: "active",
      mfaEnabled: false,
      failedLoginCount: 0,
    });

    const orgId = await getOrCreateCareerApplicantOrganization();
    await OrganizationMembership.create({
      userId: user._id,
      organizationId: orgId,
      roles: ["career_applicant"],
      status: "active",
      invitedBy: user._id,
    });

    try {
      await createSession({ userId: user._id, userAgent: ua, ip });
    } catch (sessionError) {
      console.error("[register/career] session", sessionError);
      if (isSessionConfigError(sessionError)) {
        return NextResponse.json(
          { error: "Account created but sign-in failed. Please sign in manually." },
          { status: 503 },
        );
      }
      throw sessionError;
    }

    return NextResponse.json(
      { ok: true, redirectTo: "/privacy#career-application" },
      { status: 201 },
    );
  } catch (error) {
    console.error("[register/career]", error);
    return NextResponse.json({ error: "Unable to create career portal account." }, { status: 400 });
  }
}
