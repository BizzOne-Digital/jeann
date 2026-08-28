/**
 * Phase 8 seed: integration providers, feature flags, AI executions, market data, esignature, screening, jobs, webhooks.
 */
import "./load-env";
import { getEnv } from "@/lib/config/env";
import { connectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { Types } from "mongoose";
import { seedDefaultFeatureFlags } from "@/lib/integrations/feature-flags";
import { createHash } from "crypto";

const QA = "DEVELOPMENT TEST RESPONSE — NOT FROM A REAL PROVIDER";

async function main() {
  const env = getEnv();
  if (env.NODE_ENV === "production") {
    console.error("seed-phase8 refuses to run in production.");
    process.exit(1);
  }
  if (!isMongoConfigured()) {
    console.error("MONGODB_URI required.");
    process.exit(1);
  }

  process.env.INTEGRATIONS_USE_MOCKS = "true";

  await connectMongo();
  await seedDefaultFeatureFlags();

  const {
    User,
    Organization,
    IntegrationProvider,
    IntegrationJob,
    WebhookEvent,
    AIExecution,
    AIPromptTemplate,
    MarketDataObservation,
    MarketAlert,
    ESignatureEnvelope,
    ESignatureRecipient,
    ScreeningCase,
    ScreeningMatch,
    AccountingSyncRecord,
    Document,
    DocumentVersion,
  } = await import("@/models");

  const tradeUser = await User.findOne({ email: "trade@test.finekarts.local" });
  const financeUser = await User.findOne({ email: "finance@test.finekarts.local" });
  const buyerOrg = await Organization.findOne({ legalName: "Atlas Global Foods Test Ltd." });

  if (!tradeUser || !financeUser) {
    console.error("Run seed:phase2 first.");
    process.exit(1);
  }

  const providers = [
    { providerType: "ai", providerName: "Mock AI", adapterCode: "development_mock_ai", capabilities: ["extract", "compare"] },
    { providerType: "market_data", providerName: "Mock Vesper", adapterCode: "development_mock_vesper", capabilities: ["observations"] },
    { providerType: "esignature", providerName: "Mock E-Sign", adapterCode: "development_mock_esignature", capabilities: ["envelope"] },
    { providerType: "screening", providerName: "Mock Screening", adapterCode: "development_mock_screening", capabilities: ["sanctions"] },
    { providerType: "accounting", providerName: "Development Accounting", adapterCode: "development_mock", capabilities: ["sync"] },
  ];

  for (const p of providers) {
    await IntegrationProvider.findOneAndUpdate(
      { adapterCode: p.adapterCode },
      { ...p, active: true, environment: env.NODE_ENV, lastHealthStatus: "connected" },
      { upsert: true },
    );
  }

  if (!await AIPromptTemplate.findOne({ name: "document_extraction", version: 1 })) {
    await AIPromptTemplate.create({
      name: "document_extraction",
      capability: "extract_document_fields",
      version: 1,
      systemInstruction: "Extract structured trade document fields. Human review required.",
      allowedRoles: ["trade_manager", "finance"],
      active: true,
      createdByUserId: tradeUser._id,
      effectiveFrom: new Date(),
    });
  }

  if (!await AIExecution.findOne({ qaMarker: QA })) {
    await AIExecution.create({
      providerAdapter: "development_mock_ai",
      model: "mock-model",
      capability: "extract_document_fields",
      promptTemplateVersion: "1",
      userId: tradeUser._id,
      dataClassification: "confidential",
      structuredOutput: { fields: [{ fieldKey: "product", extractedValue: "Sunflower Oil", confidence: 0.85 }] },
      humanReviewStatus: "pending_review",
      qaMarker: QA,
    });
    await AIExecution.create({
      providerAdapter: "development_mock_ai",
      model: "mock-model",
      capability: "compare_documents",
      userId: tradeUser._id,
      dataClassification: "confidential",
      structuredOutput: { findings: [{ severity: "ai_review_point", description: "Review quantity alignment." }] },
      humanReviewStatus: "pending_review",
      qaMarker: QA,
    });
  }

  if (!await MarketDataObservation.findOne({ providerReference: "MOCK-VESPER-SEED" })) {
    await MarketDataObservation.create({
      providerAdapter: "development_mock_vesper",
      commodity: "sunflower_oil",
      marketRegion: "EU",
      dataType: "spot",
      unit: "MT",
      currency: "USD",
      observationDate: new Date(),
      value: Types.Decimal128.fromString("1050"),
      providerReference: "MOCK-VESPER-SEED",
      licensingClassification: "internal_only",
      importedAt: new Date(),
    });
  }

  if (!await MarketAlert.findOne({ commodity: "sunflower_oil" })) {
    await MarketAlert.create({
      userId: financeUser._id,
      commodity: "sunflower_oil",
      marketRegion: "EU",
      condition: "above",
      threshold: Types.Decimal128.fromString("1000"),
      currency: "USD",
      unit: "MT",
      frequency: "daily",
      active: true,
      notificationChannels: ["in_app"],
    });
  }

  let docVersion = await DocumentVersion.findOne({ status: "approved" });
  if (!docVersion) {
    const doc = await Document.create({
      organizationId: buyerOrg?._id ?? tradeUser._id,
      title: "TEST SPA — NOT VALID",
      documentType: "spa",
      category: "contract",
      sensitivity: "confidential",
      retentionState: "active",
      buyerVisible: true,
      supplierVisible: false,
      internalOnly: false,
      workflowStatus: "approved",
      createdByUserId: tradeUser._id,
    });
    docVersion = await DocumentVersion.create({
      documentId: doc._id,
      version: 1,
      storageKey: "test/spa-phase8.pdf",
      checksum: createHash("sha256").update("phase8-test").digest("hex"),
      mimeType: "application/pdf",
      size: 1024,
      uploadedBy: tradeUser._id,
      status: "approved",
      watermarkPolicy: "draft",
      locked: false,
    });
  }

  if (!await ESignatureEnvelope.findOne({ qaMarker: QA })) {
    const envelope = await ESignatureEnvelope.create({
      providerAdapter: "development_mock_esignature",
      internalEnvelopeNumber: "FK-ESIGN-2026-TEST-0001",
      providerEnvelopeId: "MOCK-ESIGN-SEED",
      documentVersionId: docVersion._id,
      status: "sent",
      createdByUserId: tradeUser._id,
      sentAt: new Date(),
      qaMarker: QA,
    });
    await ESignatureRecipient.create({
      envelopeId: envelope._id,
      legalName: "Test Signer",
      email: "buyer-a@test.finekarts.local",
      signingOrder: 1,
      role: "signer",
      status: "sent",
    });
  }

  if (buyerOrg && !await ScreeningCase.findOne({ qaMarker: QA })) {
    const screeningCase = await ScreeningCase.create({
      organizationId: buyerOrg._id,
      providerAdapter: "development_mock_screening",
      screeningType: "sanctions",
      providerRequestRef: "MOCK-SCR-SEED",
      status: "match_found",
      matchCount: 1,
      riskLevel: "low",
      submittedByUserId: financeUser._id,
      qaMarker: QA,
    });
    await ScreeningMatch.create({
      screeningCaseId: screeningCase._id,
      providerMatchId: "MOCK-MATCH-SEED",
      matchType: "sanctions",
      matchedName: buyerOrg.legalName,
      matchScore: Types.Decimal128.fromString("0.42"),
      country: "CA",
      sourceListRef: "MOCK-LIST",
      reviewStatus: "pending",
    });
  }

  if (!await IntegrationJob.findOne({ idempotencyKey: "phase8-seed-job" })) {
    await IntegrationJob.create({
      providerAdapter: "development_mock",
      jobType: "accounting_sync",
      internalEntityType: "invoice",
      internalEntityId: "seed-invoice",
      idempotencyKey: "phase8-seed-job",
      attemptCount: 2,
      maxAttempts: 5,
      status: "retry_scheduled",
      correlationId: "seed-correlation-1",
      errorSummary: "TEST retry job",
    });
  }

  if (!await WebhookEvent.findOne({ providerEventId: "phase8-failed-webhook" })) {
    await WebhookEvent.create({
      providerAdapter: "shipping_tracking",
      providerEventId: "phase8-failed-webhook",
      eventType: "tracking_event",
      signatureVerified: false,
      processingStatus: "failed",
      payloadHash: createHash("sha256").update("failed").digest("hex"),
      correlationId: "seed-webhook-fail",
      attemptCount: 1,
      errorSummary: "TEST failed webhook verification",
    });
  }

  if (!await AccountingSyncRecord.findOne({ idempotencyKey: "phase8:accounting:seed" })) {
    await AccountingSyncRecord.create({
      provider: "development_mock",
      entityType: "invoice",
      internalEntityId: "seed-invoice",
      syncDirection: "push",
      status: "not_configured",
      idempotencyKey: "phase8:accounting:seed",
      lastAttemptAt: new Date(),
      errorSummary: "Not configured — CSV export available",
    });
  }

  console.log("Phase 8 seed complete.");
  console.log("Set INTEGRATIONS_USE_MOCKS=true for development mocks.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
