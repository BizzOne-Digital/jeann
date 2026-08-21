import { getEnv } from "@/lib/config/env";
import { sendEmail } from "@/lib/email";

function appUrl() {
  return getEnv().APP_URL.replace(/\/$/, "");
}

function adminNotifyEmail() {
  const env = getEnv();
  return env.ADMIN_NOTIFY_EMAIL || env.INITIAL_ADMIN_EMAIL || null;
}

export async function notifyAdminNewBuyerRegistration(input: {
  organizationName: string;
  contactName: string;
  contactEmail: string;
  country: string;
  organizationId: string;
}) {
  const to = adminNotifyEmail();
  if (!to) return;

  await sendEmail({
    to: { email: to, name: "Finekarts Admin" },
    subject: `New buyer registration — ${input.organizationName}`,
    text: [
      "A new buyer organization registered on Finekarts.",
      "",
      `Company: ${input.organizationName}`,
      `Contact: ${input.contactName} <${input.contactEmail}>`,
      `Country: ${input.country}`,
      "",
      `Review in admin: ${appUrl()}/admin/buyers/${input.organizationId}`,
    ].join("\n"),
    tags: ["buyer-registration", "admin"],
    metadata: { organizationId: input.organizationId },
  });
}

export async function notifyBuyerRegistrationReceived(input: {
  contactEmail: string;
  contactName: string;
  organizationName: string;
}) {
  await sendEmail({
    to: { email: input.contactEmail, name: input.contactName },
    subject: "Finekarts — registration received",
    text: [
      `Hello ${input.contactName},`,
      "",
      `We received your registration for ${input.organizationName}.`,
      "Our team will review your organization and email you when your buyer portal access is approved.",
      "",
      `Sign in later at: ${appUrl()}/login`,
      "",
      "Finekarts Trade Desk",
    ].join("\n"),
    tags: ["buyer-registration"],
  });
}

export async function notifyBuyerApproved(input: {
  contactEmail: string;
  contactName: string;
  organizationName: string;
}) {
  await sendEmail({
    to: { email: input.contactEmail, name: input.contactName },
    subject: "Finekarts — your buyer account is approved",
    text: [
      `Hello ${input.contactName},`,
      "",
      `Your organization (${input.organizationName}) has been approved.`,
      "You can now sign in and use the buyer portal to submit requests and manage your account.",
      "",
      `Sign in: ${appUrl()}/login`,
      "",
      "Finekarts Trade Desk",
    ].join("\n"),
    tags: ["buyer-approved"],
  });
}

export async function notifyBuyerRejected(input: {
  contactEmail: string;
  contactName: string;
  organizationName: string;
  reason?: string;
}) {
  await sendEmail({
    to: { email: input.contactEmail, name: input.contactName },
    subject: "Finekarts — buyer registration update",
    text: [
      `Hello ${input.contactName},`,
      "",
      `We reviewed the registration for ${input.organizationName} and cannot approve access at this time.`,
      input.reason ? `Note: ${input.reason}` : "",
      "",
      "Contact the trade desk if you have questions.",
      "",
      "Finekarts Trade Desk",
    ]
      .filter(Boolean)
      .join("\n"),
    tags: ["buyer-rejected"],
  });
}
