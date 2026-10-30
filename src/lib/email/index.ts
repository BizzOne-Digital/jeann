import { getEnv } from "@/lib/config/env";
import { ConsoleEmailProvider } from "@/lib/email/console";
import { ResendEmailProvider } from "@/lib/email/resend";
import { SmtpEmailProvider } from "@/lib/email/smtp";
import type { EmailProvider, SendEmailInput, SendEmailResult } from "@/lib/email/types";

let cached: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (cached) return cached;
  const env = getEnv();
  switch (env.EMAIL_PROVIDER) {
    case "console":
    case "none":
      cached = new ConsoleEmailProvider();
      return cached;
    case "resend":
      cached = new ResendEmailProvider();
      return cached;
    case "smtp":
      cached = new SmtpEmailProvider();
      return cached;
    default:
      cached = new ConsoleEmailProvider();
      return cached;
  }
}

/** Send email via configured provider. Never attach raw document contents. */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  return getEmailProvider().send(input);
}

export type { EmailProvider, SendEmailInput, SendEmailResult } from "@/lib/email/types";

/**
 * True when messages will really be delivered. In production the console/none providers only
 * log, so verification flows must not pretend a code was sent.
 */
export function isEmailDeliveryConfigured(): boolean {
  const env = getEnv();
  if (env.NODE_ENV !== "production") return true;
  switch (env.EMAIL_PROVIDER) {
    case "smtp":
      return Boolean(env.SMTP_HOST?.trim() && env.SMTP_USER?.trim() && env.SMTP_PASS?.trim());
    case "resend":
      return Boolean(env.EMAIL_API_KEY?.trim() && env.EMAIL_FROM?.trim());
    default:
      return false;
  }
}
