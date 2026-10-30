export type EmailFailureCode =
  | "email_not_configured"
  | "smtp_auth_failed"
  | "smtp_connection"
  | "send_failed";

export type EmailFailure = { code: EmailFailureCode; message: string };

/** Turns a send error into a safe, human-readable reason (never includes secrets). */
export function classifyEmailError(error: unknown): EmailFailure {
  const err = error as { message?: string; code?: string; responseCode?: number } | undefined;
  const message = err?.message ?? "";
  const code = err?.code ?? "";

  if (message === "email_not_configured" || /SMTP_HOST, SMTP_USER and SMTP_PASS are required/.test(message)) {
    return {
      code: "email_not_configured",
      message: "Email delivery is not set up on the server yet (the email settings are missing).",
    };
  }
  if (code === "EAUTH" || err?.responseCode === 535 || err?.responseCode === 534 || /Invalid login|Username and Password not accepted|BadCredentials/i.test(message)) {
    return {
      code: "smtp_auth_failed",
      message: "The mail server rejected the login. The email account or app password needs to be checked.",
    };
  }
  if (["ECONNECTION", "ETIMEDOUT", "ESOCKET", "EDNS", "ECONNREFUSED", "ENOTFOUND"].includes(code)) {
    return {
      code: "smtp_connection",
      message: "The server could not connect to the mail server. Please try again shortly.",
    };
  }
  return {
    code: "send_failed",
    message: "We could not send the email right now. Please try again in a minute or contact support.",
  };
}
