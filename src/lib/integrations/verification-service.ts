import { writeAuditEvent } from "@/lib/audit/log";
import {
  isVerificationChannelConfigured,
  submitVerificationRequest,
  verificationChannelHealth,
  type VerificationChannel,
} from "@/lib/integrations/providers/verification/http-verification-client";

export async function getFinekartsVerificationStatus() {
  const [kyb, tic] = await Promise.all([
    verificationChannelHealth("kyb"),
    verificationChannelHealth("tic"),
  ]);
  return {
    kyb: { configured: isVerificationChannelConfigured("kyb"), ...kyb },
    tic: { configured: isVerificationChannelConfigured("tic"), ...tic },
    disclaimer: "KYB and TIC verification adapters are Finekarts-internal only — not exposed to buyer or supplier portals.",
    checkedAt: new Date().toISOString(),
  };
}

export async function runFinekartsVerification(input: {
  channel: VerificationChannel;
  actorUserId: string;
  organizationId?: string;
  shipmentLotId?: string;
  reference?: string;
  payload?: Record<string, unknown>;
}) {
  const body: Record<string, unknown> = {
    organizationId: input.organizationId,
    shipmentLotId: input.shipmentLotId,
    reference: input.reference,
    submittedAt: new Date().toISOString(),
    ...(input.payload ?? {}),
  };

  const result = await submitVerificationRequest(input.channel, body);

  await writeAuditEvent({
    action: `verification.${input.channel}.submitted`,
    targetType: input.organizationId ? "organization" : "shipment_lot",
    targetId: input.organizationId ?? input.shipmentLotId ?? input.reference ?? "unknown",
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { channel: input.channel },
  });

  return result;
}
