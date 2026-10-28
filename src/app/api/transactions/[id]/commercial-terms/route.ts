import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Types } from "mongoose";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { money, mulMoney } from "@/lib/finance/money";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { whitelistBuyerTerms } from "@/lib/transactions/step-rules";
import { assertOrgScope } from "@/lib/authorization/authorize";

export const runtime = "nodejs";

const updateSchema = z.object({
  productName: z.string().optional(),
  quantity: z.string().optional(),
  quantityUnit: z.string().optional(),
  quantityTolerance: z.string().optional(),
  currency: z.string().optional(),
  unitPrice: z.string().optional(),
  incoterm: z.string().optional(),
  namedPortPlace: z.string().optional(),
  loadingPort: z.string().optional(),
  destinationPort: z.string().optional(),
  packaging: z.string().optional(),
  inspectionCompany: z.string().optional(),
  paymentProposal: z.string().optional(),
  shipmentSchedule: z.string().optional(),
  buyerVisibleNotes: z.string().optional(),
  internalNotes: z.string().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const { CommercialTerms, Transaction } = await import("@/models");
    const tx = await Transaction.findById(id).lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });

    if (!auth.ctx.isInternal) {
      await assertOrgScope(auth.ctx.userId, String(tx.organizationId), "transactions:read");
    }

    if (!auth.ctx.isInternal) {
      if (tx.side === "supplier") {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      const access = await assertBuyerTransactionAccess(auth.ctx.userId);
      if (access.organizationId !== String(tx.organizationId)) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    }
    const terms = await CommercialTerms.findOne({ transactionId: tx._id })
      .sort({ version: -1 })
      .lean();
    return NextResponse.json({
      terms: auth.ctx.isInternal ? terms : whitelistBuyerTerms(terms as Record<string, unknown> | null),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:write" });
    if ("error" in auth) return auth.error;

    if (!auth.ctx.isInternal) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    const { id } = await params;
    const body = updateSchema.parse(await request.json());
    const { CommercialTerms, Transaction } = await import("@/models");
    const tx = await Transaction.findById(id);
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });

    if (!auth.ctx.isInternal) {
      await assertOrgScope(auth.ctx.userId, String(tx.organizationId), "transactions:write");
    }

    let terms = await CommercialTerms.findOne({
      transactionId: tx._id,
      approvalStatus: "draft",
    }).sort({ version: -1 });

    if (!terms) {
      terms = await CommercialTerms.create({
        transactionId: tx._id,
        organizationId: tx.organizationId,
        productName: body.productName ?? "Product",
        quantity: Types.Decimal128.fromString(body.quantity ?? "0"),
        quantityUnit: body.quantityUnit ?? "MT",
        currency: body.currency ?? "USD",
        unitPrice: Types.Decimal128.fromString(body.unitPrice ?? "0"),
        totalEstimatedValue: Types.Decimal128.fromString("0"),
        incoterm: body.incoterm ?? "FOB",
        version: 1,
        approvalStatus: "draft",
      });
    }

    if (body.productName) terms.productName = body.productName;
    if (body.quantity) terms.quantity = Types.Decimal128.fromString(body.quantity);
    if (body.quantityUnit) terms.quantityUnit = body.quantityUnit;
    if (body.quantityTolerance) terms.quantityTolerance = body.quantityTolerance;
    if (body.currency) terms.currency = body.currency.toUpperCase();
    if (body.unitPrice) terms.unitPrice = Types.Decimal128.fromString(body.unitPrice);
    if (body.incoterm) terms.incoterm = body.incoterm;
    if (body.namedPortPlace) terms.namedPortPlace = body.namedPortPlace;
    if (body.loadingPort) terms.loadingPort = body.loadingPort;
    if (body.destinationPort) terms.destinationPort = body.destinationPort;
    if (body.packaging) terms.packaging = body.packaging;
    if (body.inspectionCompany) terms.inspectionCompany = body.inspectionCompany;
    if (body.paymentProposal) terms.paymentProposal = body.paymentProposal;
    if (body.shipmentSchedule) terms.shipmentSchedule = body.shipmentSchedule;
    if (body.buyerVisibleNotes) terms.buyerVisibleNotes = body.buyerVisibleNotes;
    if (body.internalNotes) terms.internalNotes = body.internalNotes;

    const qty = money(terms.quantity.toString());
    const price = money(terms.unitPrice.toString());
    terms.totalEstimatedValue = Types.Decimal128.fromString(mulMoney(qty, price).toString());

    await terms.save();
    return NextResponse.json({ ok: true, termsId: String(terms._id) });
  } catch (error) {
    return handleApiError(error);
  }
}
