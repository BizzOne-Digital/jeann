import { getEnv } from "@/lib/config/env";

export type SendSmsInput = {
  to: string;
  body: string;
  tags?: string[];
};

export async function sendSms(input: SendSmsInput): Promise<{ ok: boolean }> {
  const env = getEnv();
  if (env.SMS_PROVIDER === "none") {
    if (env.NODE_ENV === "production") {
      console.warn("[sms] SMS_PROVIDER=none in production; message not sent.");
      return { ok: false };
    }
    console.info("[sms:console]", { to: input.to, body: input.body, tags: input.tags });
    return { ok: true };
  }

  if (env.SMS_PROVIDER === "console") {
    console.info("[sms:console]", { to: input.to, body: input.body, tags: input.tags });
    return { ok: true };
  }

  const sid = env.TWILIO_ACCOUNT_SID?.trim();
  const token = env.TWILIO_AUTH_TOKEN?.trim();
  const from = env.TWILIO_FROM_NUMBER?.trim();
  if (!sid || !token || !from) {
    console.error("[sms] Twilio selected but TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER are missing.");
    return { ok: false };
  }

  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: input.to, From: from, Body: input.body }),
    });
    if (!res.ok) {
      console.error("[sms] Twilio error", res.status);
      return { ok: false };
    }
    return { ok: true };
  } catch (error) {
    console.error("[sms] Twilio request failed", error);
    return { ok: false };
  }
}
