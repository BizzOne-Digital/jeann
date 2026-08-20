import "./load-env";
import { connectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { getEnv } from "@/lib/config/env";
import { hashPassword } from "@/lib/auth/password";
import { SITE } from "@/lib/content/catalog";

async function main() {
  if (!isMongoConfigured()) {
    throw new Error("MONGODB_URI required");
  }
  const env = getEnv();
  if (!env.INITIAL_ADMIN_EMAIL || !env.INITIAL_ADMIN_PASSWORD) {
    throw new Error("Set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD");
  }

  await connectMongo();
  const { User, Organization, OrganizationMembership } = await import("@/models");
  const email = env.INITIAL_ADMIN_EMAIL.toLowerCase();
  let user = await User.findOne({ email });
  const passwordHash = await hashPassword(env.INITIAL_ADMIN_PASSWORD);
  if (!user) {
    user = await User.create({
      email,
      passwordHash,
      name: env.INITIAL_ADMIN_NAME || "Platform Administrator",
      emailVerifiedAt: new Date(),
      status: "active",
    });
  } else {
    await User.updateOne(
      { _id: user._id },
      { $set: { passwordHash, status: "active", deletedAt: null } },
    );
  }

  let org = await Organization.findOne({ type: "internal" });
  if (!org) {
    org = await Organization.create({
      type: "internal",
      legalName: SITE.name,
      normalizedLegalName: "finekarts",
      country: "CA",
      status: "verified",
    });
  }

  await OrganizationMembership.findOneAndUpdate(
    { userId: user._id, organizationId: org._id },
    {
      userId: user._id,
      organizationId: org._id,
      roles: ["ceo_super_admin"],
      status: "active",
    },
    { upsert: true },
  );

  console.log(`Administrator ready: ${email}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
