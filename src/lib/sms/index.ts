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

  throw new Error("Twilio SMS provider is not implemented yet. Use SMS_PROVIDER=console.");
}
