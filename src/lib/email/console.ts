import { nanoid } from "nanoid";
import type { EmailProvider, SendEmailInput, SendEmailResult } from "@/lib/email/types";

/**
 * Development email provider — logs metadata only.
 * Never logs full message bodies that may contain PII or document excerpts.
 */
export class ConsoleEmailProvider implements EmailProvider {
  readonly name = "console";

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    const recipients = Array.isArray(input.to) ? input.to : [input.to];
    const id = `console_${nanoid(12)}`;

    console.info("[email:console]", {
      id,
      to: recipients.map((r) => r.email),
      subject: input.subject,
      textLength: input.text.length,
      tags: input.tags,
      metadata: input.metadata,
    });

    return { id, provider: this.name };
  }
}
