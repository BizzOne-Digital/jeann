import { getAuthContext } from "@/lib/auth/auth-context";
import { ForbiddenError } from "@/lib/auth/errors";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { isFeatureEnabled } from "@/lib/integrations/feature-flags";
import { getAIProvider } from "@/lib/integrations/providers/ai-registry";
import { redactSensitive, sanitizeUserInput } from "@/lib/ai/security";

export async function askInternalAssistant(input: {
  userId: string;
  question: string;
  transactionId?: string;
}) {
  if (!(await isFeatureEnabled("internal_ai_assistant"))) {
    throw new Error("feature_disabled");
  }

  const ctx = await getAuthContext(input.userId);
  if (!ctx?.isInternal) throw new ForbiddenError("Internal assistant only");

  const safeQuestion = sanitizeUserInput(input.question);
  const sources: string[] = [];

  let contextBlock = "";

  if (input.transactionId) {
    const canRead = ctx.permissions.includes("transactions:read");
    if (!canRead) throw new ForbiddenError("No access to this transaction");

    await tryConnectMongo();
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findById(input.transactionId).lean();
    if (!tx) throw new ForbiddenError("Transaction not found");

    contextBlock = `Transaction ${tx.transactionNumber} status: ${tx.workflowStatus ?? "unknown"}.`;
    sources.push(`transaction:${tx.transactionNumber}`);

    if (!ctx.permissions.includes("finance:read")) {
      contextBlock += " Financial details withheld — insufficient permission.";
    }
  }

  const provider = getAIProvider();
  const knowledgeContext = contextBlock || "No assigned transaction context provided.";
  const result = await provider.answerKnowledgeQuestion({
    question: safeQuestion,
    knowledgeContext: redactSensitive(knowledgeContext),
  });

  return {
    answer: result.data?.answer ?? result.errorSummary ?? "Unable to answer.",
    sources,
    disclaimer: result.disclaimer,
    provider: provider.adapterCode,
  };
}
