import { Types } from "mongoose";
import { tryConnectMongo } from "@/lib/db/mongoose";

export type MessageThreadSummary = {
  id: string;
  subject: string;
  transactionId?: string;
  visibility: string;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  unreadCount: number;
};

export type MessageItem = {
  id: string;
  body: string;
  authorUserId: string;
  authorName?: string;
  createdAt: string;
};

export async function listThreadsForOrganization(
  organizationId: string,
  visibility: "external" | "internal" = "external",
): Promise<MessageThreadSummary[]> {
  if (!(await tryConnectMongo())) return [];

  const { MessageThread, Message } = await import("@/models");
  const threads = await MessageThread.find({
    organizationId: new Types.ObjectId(organizationId),
    visibility,
  })
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();

  const summaries: MessageThreadSummary[] = [];
  for (const thread of threads) {
    const last = await Message.findOne({ threadId: thread._id })
      .sort({ createdAt: -1 })
      .lean();
    summaries.push({
      id: String(thread._id),
      subject: thread.subject,
      transactionId: thread.transactionId ? String(thread.transactionId) : undefined,
      visibility: thread.visibility,
      lastMessageAt: last?.createdAt ? new Date(last.createdAt).toISOString() : undefined,
      lastMessagePreview: last?.body?.slice(0, 120),
      unreadCount: 0,
    });
  }
  return summaries;
}

export async function getThreadMessages(
  threadId: string,
  organizationId: string,
): Promise<{ subject: string; messages: MessageItem[] } | null> {
  if (!(await tryConnectMongo())) return null;

  const { MessageThread, Message, User } = await import("@/models");
  const thread = await MessageThread.findOne({
    _id: new Types.ObjectId(threadId),
    organizationId: new Types.ObjectId(organizationId),
    visibility: "external",
  }).lean();

  if (!thread) return null;

  const messages = await Message.find({ threadId: thread._id }).sort({ createdAt: 1 }).lean();
  const authorIds = [...new Set(messages.map((m) => String(m.authorUserId)))];
  const users = await User.find({ _id: { $in: authorIds } }).lean();
  const nameById = new Map(users.map((u) => [String(u._id), u.name]));

  return {
    subject: thread.subject,
    messages: messages.map((m) => ({
      id: String(m._id),
      body: m.body,
      authorUserId: String(m.authorUserId),
      authorName: nameById.get(String(m.authorUserId)),
      createdAt: new Date(m.createdAt).toISOString(),
    })),
  };
}

export async function createThreadWithMessage(input: {
  organizationId: string;
  authorUserId: string;
  subject: string;
  body: string;
  transactionId?: string;
}): Promise<string | null> {
  if (!(await tryConnectMongo())) return null;

  const { MessageThread, Message } = await import("@/models");
  const thread = await MessageThread.create({
    organizationId: new Types.ObjectId(input.organizationId),
    transactionId: input.transactionId
      ? new Types.ObjectId(input.transactionId)
      : undefined,
    visibility: "external",
    subject: input.subject.trim(),
  });

  await Message.create({
    threadId: thread._id,
    authorUserId: new Types.ObjectId(input.authorUserId),
    body: input.body.trim(),
    readBy: [{ userId: new Types.ObjectId(input.authorUserId), readAt: new Date() }],
  });

  return String(thread._id);
}

export async function replyToThread(input: {
  threadId: string;
  organizationId: string;
  authorUserId: string;
  body: string;
}): Promise<boolean> {
  if (!(await tryConnectMongo())) return false;

  const { MessageThread, Message } = await import("@/models");
  const thread = await MessageThread.findOne({
    _id: new Types.ObjectId(input.threadId),
    organizationId: new Types.ObjectId(input.organizationId),
    visibility: "external",
  });

  if (!thread) return false;

  await Message.create({
    threadId: thread._id,
    authorUserId: new Types.ObjectId(input.authorUserId),
    body: input.body.trim(),
    readBy: [{ userId: new Types.ObjectId(input.authorUserId), readAt: new Date() }],
  });

  thread.updatedAt = new Date();
  await thread.save();
  return true;
}
