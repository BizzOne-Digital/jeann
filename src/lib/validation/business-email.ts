const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "mail.com",
  "gmx.com",
  "yandex.com",
  "zoho.com",
]);

export function isBusinessEmail(email: string): boolean {
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];
  if (!domain || domain.includes(" ") || !domain.includes(".")) return false;
  return !FREE_EMAIL_DOMAINS.has(domain);
}

export const BUSINESS_EMAIL_MESSAGE =
  "Use your company business email address (public providers such as Gmail or Yahoo are not accepted).";
