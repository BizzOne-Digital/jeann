import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  createShipmentScheduleDraft,
  approveShipmentSchedule,
} from "@/lib/shipments/schedule-service";

export const runtime = "nodejs";

const createSchema = z.object({
  transactionId: z.string(),
  transactionSide: z.enum(["buyer_sale", "supplier_purchase"]),
  startDate: z.string(),
  endDate: z.string(),
  frequency: z.enum(["one_time", "weekly", "monthly", "quarterly", "custom"]),
  plannedLotCount: z.number().int().min(1),
  plannedQuantityPerLot: z.string(),
  quantityUnit: z.string(),
  quantityTolerance: z.string().optional(),
});

const approveSchema = z.object({
  scheduleId: z.string(),
  generateLots: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "shipments:write" });
    if ("error" in auth) return auth.error;

    const body = await request.json();
    if (body.action === "approve") {
      const parsed = approveSchema.parse(body);
      const result = await approveShipmentSchedule({
        scheduleId: parsed.scheduleId,
        actorUserId: auth.ctx.userId,
        generateLots: parsed.generateLots ?? true,
      });
      return NextResponse.json({
        scheduleId: String(result.schedule._id),
        status: result.schedule.status,
        lotsCreated: result.lots.length,
      });
    }

    const parsed = createSchema.parse(body);
    const schedule = await createShipmentScheduleDraft({
      ...parsed,
      actorUserId: auth.ctx.userId,
    });

    return NextResponse.json({
      id: String(schedule._id),
      version: schedule.version,
      status: schedule.status,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "schedule_exceeds_contract_quantity") {
      return NextResponse.json({ error: "Schedule exceeds contract quantity." }, { status: 400 });
    }
    return handleApiError(error);
  }
}
