import { getEnv } from "@/lib/config/env";
import { ConsoleEmailProvider } from "@/lib/email/console";
import { ResendEmailProvider } from "@/lib/email/resend";
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
      throw new Error(
        `${env.EMAIL_PROVIDER} email provider is not implemented yet. Use EMAIL_PROVIDER=resend or console.`,
      );
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
