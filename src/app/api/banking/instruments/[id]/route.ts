import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBankingInstrumentAccess } from "@/lib/banking/access";
import { BANKING_STATUS_LABELS } from "@/lib/banking/workflow";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const access = await assertBankingInstrumentAccess(auth.ctx.userId, id);

    const {
      InstrumentWordingVersion,
      BankingReview,
      BankingDeadline,
      InstrumentStatusHistory,
      BankingPartyAssignment,
    } = await import("@/models");

    const wording = await InstrumentWordingVersion.find({
      bankingInstrumentId: access.instrument._id,
    })
      .sort({ version: -1 })
      .lean();
    const reviews = await BankingReview.find({ bankingInstrumentId: access.instrument._id })
      .sort({ reviewedAt: -1 })
      .limit(20)
      .lean();
    const deadlines = await BankingDeadline.find({
      bankingInstrumentId: access.instrument._id,
      status: { $nin: ["cancelled", "superseded"] },
    }).lean();
    const history = await InstrumentStatusHistory.find({
      bankingInstrumentId: access.instrument._id,
    })
      .sort({ transitionedAt: -1 })
      .limit(30)
      .lean();
    const assignments = await BankingPartyAssignment.find({
      bankingInstrumentId: access.instrument._id,
      active: true,
    }).lean();

    const inst = access.instrument;
    return NextResponse.json({
      instrument: {
        id: String(inst._id),
        instrumentId: inst.instrumentId,
        transactionId: String(inst.transactionId),
        transactionSide: inst.transactionSide,
        instrumentTypeCode: inst.instrumentTypeCode,
        currentStatus: inst.currentStatus,
        statusLabel: BANKING_STATUS_LABELS[inst.currentStatus] ?? inst.currentStatus,
        currency: inst.currency,
        amount: inst.amount?.toString(),
        amountTolerance: inst.amountTolerance,
        goodsDescription: inst.goodsDescription,
        loadingPortPlace: inst.loadingPortPlace,
        destinationPortPlace: inst.destinationPortPlace,
        expiryDate: inst.expiryDate,
        latestShipmentDate: inst.latestShipmentDate,
        presentationPeriod: inst.presentationPeriod,
        issuedCopyVerificationStatus: inst.issuedCopyVerificationStatus,
        adviceAuthenticationStatus: inst.adviceAuthenticationStatus,
        adviceReference: inst.adviceReference,
        issuanceRequestedAt: inst.issuanceRequestedAt,
        issuanceRequestReference: inst.issuanceRequestReference,
      },
      wordingVersions: wording.map((w) => ({
        id: String(w._id),
        version: w.version,
        source: w.source,
        status: w.status,
      })),
      reviews: reviews.map((r) => ({
        id: String(r._id),
        reviewType: r.reviewType,
        decision: r.decision,
        isRecommendationOnly: r.isRecommendationOnly,
        reviewedAt: r.reviewedAt,
      })),
      deadlines,
      statusHistory: history,
      assignments: assignments.map((a) => ({
        userId: a.userId ? String(a.userId) : null,
        bankingRole: a.bankingRole,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
