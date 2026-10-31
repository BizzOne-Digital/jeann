import { beforeEach, describe, expect, it, vi } from "vitest";
import { Types } from "mongoose";

type Doc = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  purpose: string;
  codeHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
  attempts: number;
  createdAt: number;
  save: () => Promise<void>;
};

const store: Doc[] = [];
let tick = 0;

function matches(doc: Doc, filter: Record<string, unknown>): boolean {
  if (filter.userId && String(doc.userId) !== String(filter.userId)) return false;
  if (filter.purpose && doc.purpose !== filter.purpose) return false;
  if ("consumedAt" in filter && filter.consumedAt === null && doc.consumedAt !== null) return false;
  const exp = filter.expiresAt as { $gt?: Date } | undefined;
  if (exp?.$gt && !(doc.expiresAt > exp.$gt)) return false;
  const id = filter._id as { $in?: Types.ObjectId[] } | undefined;
  if (id?.$in && !id.$in.some((x) => String(x) === String(doc._id))) return false;
  return true;
}

vi.mock("@/lib/db/mongoose", () => ({
  isMongoConfigured: () => true,
  tryConnectMongo: async () => true,
}));

vi.mock("@/models/VerificationChallenge", () => ({
  VerificationChallenge: {
    find(filter: Record<string, unknown>) {
      let rows = store.filter((d) => matches(d, filter));
      const q = {
        sort: () => {
          rows = [...rows].sort((a, b) => b.createdAt - a.createdAt);
          return q;
        },
        select: () => q,
        limit: (n: number) => {
          rows = rows.slice(0, n);
          return q;
        },
        lean: () => q,
        then: (resolve: (v: Doc[]) => unknown) => resolve(rows),
      };
      return q;
    },
    async updateMany(filter: Record<string, unknown>, update: { $set: { consumedAt: Date } }) {
      for (const d of store) if (matches(d, filter)) d.consumedAt = update.$set.consumedAt;
    },
    async create(data: Omit<Doc, "_id" | "createdAt" | "save" | "consumedAt">) {
      const doc: Doc = {
        ...data,
        _id: new Types.ObjectId(),
        consumedAt: null,
        createdAt: ++tick,
        save: async () => {},
      };
      store.push(doc);
      return doc;
    },
  },
}));

import { storeOtpChallenge, verifyStoredOtp } from "@/lib/auth/otp";

const userId = new Types.ObjectId();

beforeEach(() => {
  store.length = 0;
});

describe("sign-up verification codes survive a re-send", () => {
  it("accepts the first code after a second one was requested", async () => {
    await storeOtpChallenge({ userId, channel: "email", purpose: "email_verify", code: "111111" });
    await storeOtpChallenge({ userId, channel: "email", purpose: "email_verify", code: "222222" });
    expect((await verifyStoredOtp({ userId, purpose: "email_verify", code: "111111" })).valid).toBe(true);
  });

  it("accepts the newest code too", async () => {
    await storeOtpChallenge({ userId, channel: "email", purpose: "email_verify", code: "111111" });
    await storeOtpChallenge({ userId, channel: "email", purpose: "email_verify", code: "222222" });
    expect((await verifyStoredOtp({ userId, purpose: "email_verify", code: "222222" })).valid).toBe(true);
  });

  it("rejects a wrong code", async () => {
    await storeOtpChallenge({ userId, channel: "email", purpose: "email_verify", code: "111111" });
    const r = await verifyStoredOtp({ userId, purpose: "email_verify", code: "999999" });
    expect(r.valid).toBe(false);
  });

  it("keeps only the three newest live codes", async () => {
    for (const c of ["111111", "222222", "333333", "444444"]) {
      await storeOtpChallenge({ userId, channel: "email", purpose: "email_verify", code: c });
    }
    expect((await verifyStoredOtp({ userId, purpose: "email_verify", code: "111111" })).valid).toBe(false);
    expect((await verifyStoredOtp({ userId, purpose: "email_verify", code: "444444" })).valid).toBe(true);
  });

  it("a used code cannot be used again", async () => {
    await storeOtpChallenge({ userId, channel: "email", purpose: "email_verify", code: "111111" });
    expect((await verifyStoredOtp({ userId, purpose: "email_verify", code: "111111" })).valid).toBe(true);
    expect((await verifyStoredOtp({ userId, purpose: "email_verify", code: "111111" })).valid).toBe(false);
  });

  it("an expired code is rejected", async () => {
    await storeOtpChallenge({ userId, channel: "email", purpose: "email_verify", code: "111111", ttlMs: -1000 });
    expect((await verifyStoredOtp({ userId, purpose: "email_verify", code: "111111" })).valid).toBe(false);
  });

  it("password reset still keeps only one live code", async () => {
    await storeOtpChallenge({ userId, channel: "email", purpose: "password_reset", code: "111111" });
    await storeOtpChallenge({ userId, channel: "email", purpose: "password_reset", code: "222222" });
    expect((await verifyStoredOtp({ userId, purpose: "password_reset", code: "111111" })).valid).toBe(false);
    expect((await verifyStoredOtp({ userId, purpose: "password_reset", code: "222222" })).valid).toBe(true);
  });
});
