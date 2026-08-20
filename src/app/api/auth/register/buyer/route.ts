import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import { createDevBuyer, findDevOrganization, findDevUserByEmail } from "@/lib/auth/dev-store";
import {
  getSessionConfigError,
  isDuplicateKeyError,
  isSessionConfigError,
} from "@/lib/auth/session-config";
import { hashPassword } from "@/lib/auth/password";
import { registerBuyerSchema } from "@/lib/validation/auth";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { normalizeCompanyName } from "@/lib/db/ids";

export const runtime = "nodejs";

function countryCode(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  const map: Record<string, string> = {
    canada: "CA",
    "united states": "US",
    usa: "US",
    india: "IN",
    pakistan: "PK",
    "united kingdom": "GB",
    uk: "GB",
  };
  return map[trimmed.toLowerCase()] ?? (trimmed.slice(0, 2).toUpperCase() || "XX");
}

function validationMessage(issues: { fieldErrors: Record<string, string[] | undefined> }): string {
  const first =
    issues.fieldErrors.confirmPassword?.[0] ??
    issues.fieldErrors.password?.[0] ??
    issues.fieldErrors.email?.[0] ??
    issues.fieldErrors.acceptBuyerTerms?.[0] ??
    issues.fieldErrors.acceptPrivacy?.[0];
  return first ?? "Please correct the highlighted fields.";
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = registerBuyerSchema.safeParse(body);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      return NextResponse.json(
        {
          error: validationMessage(flat),
          issues: flat,
        },
        { status: 422 },
      );
    }

    const input = parsed.data;
    const email = input.email.toLowerCase();
    const passwordHash = await hashPassword(input.password);
    const ua = request.headers.get("user-agent") ?? undefined;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0];

    if (isMongoConfigured()) {
      if (!(await tryConnectMongo())) {
        return NextResponse.json(
          { error: "Database is unavailable. Please try again shortly." },
          { status: 503 },
        );
      }

      const { User, Organization, OrganizationMembership } = await import("@/models");
      const normalized = normalizeCompanyName(input.legalName) || "buyer";
      const [emailMatch, companyMatch] = await Promise.all([
        User.findOne({ email, deletedAt: null }).lean(),
        Organization.findOne({
          type: "buyer",
          normalizedLegalName: normalized,
          deletedAt: null,
        }).lean(),
      ]);
      if (emailMatch || companyMatch) {
        return NextResponse.json(
          { ok: true, status: "review", message: "Registration received for review." },
          { status: 202 },
        );
      }

      const org = await Organization.create({
        type: "buyer",
        legalName: input.legalName,
        normalizedLegalName: normalized,
        registrationNumber: input.registrationNumber,
        country: countryCode(input.country),
        domain: input.domain?.toLowerCase() || undefined,
        status: "pending",
      });

      const user = await User.create({
        email,
        passwordHash,
        name: input.contactName,
        phone: input.phone,
        status: "active",
        emailVerifiedAt: new Date(),
      });

      await OrganizationMembership.create({
        userId: user._id,
        organizationId: org._id,
        roles: ["buyer_org_admin"],
        customPermissions: [],
        status: "active",
      });

      const sessionIssue = getSessionConfigError();
      if (sessionIssue) {
        return NextResponse.json(
          {
            ok: true,
            status: "active",
            redirectTo: "/login",
            message:
              "Account created. Please sign in with your email and password. (Admin: set SESSION_SECRET on the server.)",
          },
          { status: 201 },
        );
      }

      try {
        await createSession({ userId: user._id, userAgent: ua, ip });
      } catch (sessionError) {
        console.error("[register/buyer] session", sessionError);
        return NextResponse.json(
          {
            ok: true,
            status: "active",
            redirectTo: "/login",
            message: "Account created. Please sign in with your email and password.",
          },
          { status: 201 },
        );
      }

      return NextResponse.json(
        {
          ok: true,
          status: "active",
          redirectTo: "/portal/buyer",
          message: "Account created. Redirecting…",
        },
        { status: 201 },
      );
    }

    const [emailMatch, companyMatch] = await Promise.all([
      findDevUserByEmail(email),
      findDevOrganization(input.legalName),
    ]);
    if (emailMatch || companyMatch) {
      return NextResponse.json(
        { ok: true, status: "review", message: "Registration received for review." },
        { status: 202 },
      );
    }

    const user = await createDevBuyer({
      organizationName: input.legalName,
      name: input.contactName,
      email,
      phone: input.phone,
      passwordHash,
    });

    try {
      await createSession({ userId: user.id, userAgent: ua, ip });
    } catch (sessionError) {
      console.error("[register/buyer] dev session", sessionError);
      return NextResponse.json(
        {
          ok: true,
          status: "active",
          redirectTo: "/login",
          message: "Account created. Please sign in with your email and password.",
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        status: "active",
        redirectTo: "/portal/buyer",
        message: "Account created. Redirecting…",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[register/buyer]", error);
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        { ok: true, status: "review", message: "Registration received for review." },
        { status: 202 },
      );
    }
    if (isSessionConfigError(error)) {
      return NextResponse.json(
        { error: "Server auth is not configured. Please contact support." },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Unable to complete registration. Please try again or contact support." },
      { status: 500 },
    );
  }
}
