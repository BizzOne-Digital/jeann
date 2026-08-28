/**
 * Phase 9 seed: retention policies, UAT scaffolding, security baseline (development only).
 */
import "./load-env";
import { connectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { assertNotProductionSeed } from "@/lib/security/production-guards";
import { seedDefaultRetentionPolicies } from "@/lib/security/retention-service";
import { UATTestCase } from "@/models/UATTestCase";

const UAT_CASES = [
  {
    testId: "UAT-PUB-001",
    module: "public",
    role: "public_visitor",
    steps: "Open homepage, product page, contact form.",
    expectedResult: "Pages load; forms submit without errors.",
  },
  {
    testId: "UAT-BUY-A-001",
    module: "buyer",
    role: "buyer_a",
    steps: "Login as Buyer A; open dashboard and transaction list.",
    expectedResult: "Buyer A sees only own company transactions.",
  },
  {
    testId: "UAT-ISO-001",
    module: "security",
    role: "buyer_a",
    steps: "Attempt API access to Buyer B transaction by ID.",
    expectedResult: "403 Forbidden; security event logged.",
  },
  {
    testId: "UAT-FIN-001",
    module: "finance",
    role: "finance_manager",
    steps: "View profitability for assigned transaction.",
    expectedResult: "Profitability visible; buyer cannot access same report.",
  },
  {
    testId: "UAT-AUTH-001",
    module: "auth",
    role: "admin",
    steps: "Login with MFA-required role; complete MFA.",
    expectedResult: "MFA enforced; session issued after verification.",
  },
];

async function main() {
  assertNotProductionSeed("seed-phase9");

  if (!isMongoConfigured()) {
    console.error("MONGODB_URI required.");
    process.exit(1);
  }

  await connectMongo();

  const createdPolicies = await seedDefaultRetentionPolicies();
  console.log(`Retention policies seeded: ${createdPolicies} new`);

  let uatCreated = 0;
  for (const tc of UAT_CASES) {
    const exists = await UATTestCase.findOne({ testId: tc.testId });
    if (exists) continue;
    await UATTestCase.create({ ...tc, status: "pending" });
    uatCreated += 1;
  }
  console.log(`UAT test cases seeded: ${uatCreated} new`);

  console.log("Phase 9 seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
