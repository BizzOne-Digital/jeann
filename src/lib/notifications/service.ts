import { Types } from "mongoose";
import { sendEmail } from "@/lib/email";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export type NotificationInput = {
  userId: string | Types.ObjectId;
  organizationId?: string | Types.ObjectId;
  type: string;
  title: string;
  body: string;
  href?: string;
  email?: {
    to: string;
    subject: string;
    text: string;
  };
};

export async function notifyUser(input: NotificationInput): Promise<void> {
  if (isMongoConfigured()) {
    await tryConnectMongo();
    const { Notification } = await import("@/models");
    await Notification.create({
      userId:
        input.userId instanceof Types.ObjectId
          ? input.userId
          : new Types.ObjectId(input.userId),
      organizationId: input.organizationId
        ? input.organizationId instanceof Types.ObjectId
          ? input.organizationId
          : new Types.ObjectId(input.organizationId)
        : undefined,
      type: input.type,
      title: input.title,
      body: input.body,
      href: input.href,
    });
  }

  if (input.email) {
    try {
      await sendEmail({
        to: { email: input.email.to },
        subject: input.email.subject,
        text: input.email.text,
        tags: [input.type],
      });
    } catch (error) {
      console.error("[notifyUser] email", error);
    }
  }
}

export async function notifyAdmins(input: {
  type: string;
  title: string;
  body: string;
  href?: string;
  emailSubject?: string;
  emailText?: string;
}): Promise<void> {
  if (!isMongoConfigured()) return;
  await tryConnectMongo();
  const { OrganizationMembership, User } = await import("@/models");
  const memberships = await OrganizationMembership.find({
    status: "active",
    deletedAt: null,
    roles: { $in: ["ceo_super_admin", "general_manager", "compliance_reviewer"] },
  }).lean();
  const userIds = memberships.map((m) => m.userId);
  const users = await User.find({ _id: { $in: userIds }, deletedAt: null, status: "active" }).lean();

  for (const user of users) {
    await notifyUser({
      userId: user._id,
      type: input.type,
      title: input.title,
      body: input.body,
      href: input.href,
      email: input.emailSubject
        ? {
            to: user.email,
            subject: input.emailSubject,
            text: input.emailText ?? input.body,
          }
        : undefined,
    });
  }
}
