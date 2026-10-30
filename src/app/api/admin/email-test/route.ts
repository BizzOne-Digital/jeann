import { NextResponse } from "next/server";
import { adminDeniedResponse, requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { getEnv } from "@/lib/config/env";
import { isEmailDeliveryConfigured, sendEmail } from "@/lib/email";
import { verifySmtpConnection } from "@/lib/email/smtp";

export const runtime = "nodejs";

/** Admin-only: shows which email settings are missing and whether the SMTP login works (no message is sent). */
export async function GET() {
  const session = await requireAdminApiSession();
  if (!session) return adminDeniedResponse();

  const env = getEnv();
  const missing: string[] = [];
  if (env.EMAIL_PROVIDER === "smtp") {
    if (!env.SMTP_HOST?.trim()) missing.push("SMTP_HOST");
    if (!env.SMTP_USER?.trim()) missing.push("SMTP_USER");
    if (!env.SMTP_PASS?.trim()) missing.push("SMTP_PASS");
  }

  let login: string = "not checked";
  if (env.EMAIL_PROVIDER === "smtp" && missing.length === 0) {
    try {
      await verifySmtpConnection();
      login = "ok";
    } catch (error) {
      login = `failed: ${error instanceof Error ? error.message : "unknown error"}`;
    }
  }

  return NextResponse.json({
    provider: env.EMAIL_PROVIDER,
    environment: env.NODE_ENV,
    deliveryConfigured: isEmailDeliveryConfigured(),
    missing,
    smtpHost: env.SMTP_HOST ?? null,
    smtpPort: env.SMTP_PORT ?? null,
    smtpUser: env.SMTP_USER ?? null,
    login,
  });
}

/** Admin-only: sends a test message so email delivery (SMTP) can be checked on the live site. */
export async function POST() {
  const session = await requireAdminApiSession();
  if (!session) return adminDeniedResponse();

  const env = getEnv();
  const to = session.user.email || env.ADMIN_NOTIFY_EMAIL;
  if (!to) {
    return NextResponse.json({ error: "No recipient address is available." }, { status: 422 });
  }

  try {
    const result = await sendEmail({
      to: { email: to },
      subject: "Finekarts email test",
      text: "This is a test message from the Finekarts admin area. Email delivery is working.",
    });
    return NextResponse.json({
      ok: true,
      provider: result.provider,
      to,
      note:
        result.provider === "console"
          ? "The email provider is set to console, so nothing was actually sent. Set EMAIL_PROVIDER=smtp and the SMTP_* variables on the server."
          : undefined,
    });
  } catch (error) {
    console.error("[admin/email-test]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Email could not be sent: ${error.message}`
            : "Email could not be sent.",
      },
      { status: 502 },
    );
  }
}
