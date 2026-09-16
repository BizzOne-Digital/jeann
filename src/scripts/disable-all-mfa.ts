/**
 * Clears MFA flags for every user in MongoDB (login MFA is already disabled in login-policy).
 * Run: npx tsx src/scripts/disable-all-mfa.ts
 */
import { connectMongo, isMongoConfigured } from "@/lib/db/mongoose";

async function main() {
  if (!isMongoConfigured()) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }
  await connectMongo();
  const { User } = await import("@/models");
  const result = await User.updateMany({}, { $set: { mfaEnabled: false } });
  console.log(`Updated ${result.modifiedCount} user(s); mfaEnabled=false for all accounts.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
