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

/** A buyer pressed "Submit for approval": tell the Finekarts admin and confirm to the buyer. */
export async function notifyBuyerProfileSubmitted(input: {
  organizationName: string;
  contactName: string;
  contactEmail: string;
  organizationId: string;
}) {
  const admin = adminNotifyEmail();
  if (admin) {
    await sendEmail({
      to: { email: admin, name: "Finekarts Admin" },
      subject: `Buyer awaiting approval — ${input.organizationName}`,
      text: [
        "A buyer submitted its company profile for approval.",
        "",
        `Company: ${input.organizationName}`,
        `Contact: ${input.contactName} <${input.contactEmail}>`,
        "",
        `Review and approve in admin: ${appUrl()}/admin/buyers/${input.organizationId}`,
      ].join("\n"),
      tags: ["buyer-submitted", "admin"],
      metadata: { organizationId: input.organizationId },
    });
  }
  await sendEmail({
    to: { email: input.contactEmail, name: input.contactName },
    subject: "Finekarts — company profile submitted",
    text: [
      `Hello ${input.contactName},`,
      "",
      `We received the company profile for ${input.organizationName}.`,
      "Our team will review it and email you when your buyer account is approved.",
      "",
      "Finekarts Trade Desk",
    ].join("\n"),
    tags: ["buyer-submitted"],
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

export async function notifyBuyerChangesRequested(input: {
  contactEmail: string;
  contactName: string;
  organizationName: string;
  comment: string;
}) {
  await sendEmail({
    to: { email: input.contactEmail, name: input.contactName },
    subject: "Finekarts — please update your company profile",
    text: [
      `Hello ${input.contactName},`,
      "",
      `We reviewed the company profile for ${input.organizationName} and need a change before approval:`,
      "",
      input.comment,
      "",
      `Update it and press "Submit for approval" again: ${appUrl()}/portal/buyer/cis`,
      "",
      "Finekarts Trade Desk",
    ].join("\n"),
    tags: ["buyer-changes-requested"],
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
