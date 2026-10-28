import nodemailer, { type Transporter } from "nodemailer";
import { getEnv } from "@/lib/config/env";
import type { EmailProvider, SendEmailInput, SendEmailResult } from "@/lib/email/types";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;
  const env = getEnv();
  const host = env.SMTP_HOST?.trim();
  const user = env.SMTP_USER?.trim();
  // Gmail shows app passwords in groups of four with spaces; the spaces are not part of the password.
  const pass = env.SMTP_PASS?.replace(/\s+/g, "");
  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER and SMTP_PASS are required for the SMTP email provider.");
  }
  const port = env.SMTP_PORT ?? 465;
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: env.SMTP_SECURE ?? port === 465,
    auth: { user, pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });
  return transporter;
}

function format(address: { email: string; name?: string }): string {
  return address.name ? `"${address.name.replace(/"/g, "")}" <${address.email}>` : address.email;
}

/** Sends through any SMTP server (Gmail with an app password, Google Workspace, etc.). */
export class SmtpEmailProvider implements EmailProvider {
  readonly name = "smtp";

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    const env = getEnv();
    const from = env.EMAIL_FROM?.trim() || env.SMTP_USER?.trim();
    if (!from) throw new Error("EMAIL_FROM or SMTP_USER is required for the SMTP email provider.");

    const recipients = Array.isArray(input.to) ? input.to : [input.to];
    const info = await getTransporter().sendMail({
      from,
      to: recipients.map(format),
      subject: input.subject,
      text: input.text,
      html: input.html,
      replyTo: input.replyTo ? format(input.replyTo) : undefined,
    });

    return { id: info.messageId ?? "smtp_unknown", provider: this.name };
  }
}

/** Checks the SMTP login without sending a message. */
export async function verifySmtpConnection(): Promise<void> {
  await getTransporter().verify();
}
