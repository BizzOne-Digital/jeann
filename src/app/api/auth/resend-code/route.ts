import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendVerificationCode } from "@/lib/auth/verification-service";
import { findPendingUserByEmail, throttleVerification } from "@/lib/auth/public-verification";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().email().max(320),
  channel: z.enum(["phone", "email"]),
});

/** Public (no session). Always answers the same way so it cannot be used to find accounts. */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 });
  }
  const { email, channel } = parsed.data;

  if (!throttleVerification(request, email.toLowerCase(), "resend-code", 3)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  const user = await findPendingUserByEmail(email);
  let devCode: string | undefined;

  if (user) {
    const alreadyDone = channel === "phone" ? user.phoneVerifiedAt : user.emailVerifiedAt;
    const destination = channel === "phone" ? user.phone : user.email;
    if (!alreadyDone && destination) {
      try {
        const sent = await sendVerificationCode({
          userId: String(user._id),
          channel,
          purpose: channel === "phone" ? "phone_verify" : "email_verify",
          destination,
          name: user.name,
        });
        devCode = sent.devCode;
      } catch (error) {
        console.error("[resend-code]", error);
        return NextResponse.json(
          { error: "We could not send the code right now. Please try again in a minute or contact support." },
          { status: 502 },
        );
      }
    }
  }

  return NextResponse.json({
    ok: true,
    message:
      channel === "phone"
        ? "If this account is waiting for verification, a new code was sent to the phone number on file."
        : "If this account is waiting for verification, a new code was sent to the company email.",
    devCode,
  });
}
