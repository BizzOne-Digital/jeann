import { NextResponse } from "next/server";
import { adminDeniedResponse, requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { getEnv } from "@/lib/config/env";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

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
