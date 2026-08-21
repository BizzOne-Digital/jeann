import { getEnv } from "@/lib/config/env";
import type { EmailProvider, SendEmailInput, SendEmailResult } from "@/lib/email/types";

export class ResendEmailProvider implements EmailProvider {
  readonly name = "resend";

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    const env = getEnv();
    const apiKey = env.EMAIL_API_KEY;
    const from = env.EMAIL_FROM;
    if (!apiKey || !from) {
      throw new Error("EMAIL_API_KEY and EMAIL_FROM are required for Resend.");
    }

    const recipients = Array.isArray(input.to) ? input.to : [input.to];
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients.map((r) => (r.name ? `${r.name} <${r.email}>` : r.email)),
        subject: input.subject,
        text: input.text,
        html: input.html,
        reply_to: input.replyTo?.email,
        tags: input.tags?.map((name) => ({ name, value: "true" })),
      }),
    });

    const data = (await response.json()) as { id?: string; message?: string };
    if (!response.ok) {
      throw new Error(data.message || "Resend API request failed.");
    }

    return { id: data.id ?? "resend_unknown", provider: this.name };
  }
}
