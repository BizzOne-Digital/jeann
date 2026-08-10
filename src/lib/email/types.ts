export interface EmailAddress {
  email: string;
  name?: string;
}

export interface SendEmailInput {
  to: EmailAddress | EmailAddress[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: EmailAddress;
  tags?: string[];
  /** Reference IDs only — never include document bodies or attachments with sensitive content. */
  metadata?: Record<string, string>;
}

export interface SendEmailResult {
  id: string;
  provider: string;
}

export interface EmailProvider {
  readonly name: string;
  send(input: SendEmailInput): Promise<SendEmailResult>;
}
