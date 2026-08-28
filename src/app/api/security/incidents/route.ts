import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { SecurityIncident } from "@/models/SecurityIncident";
import { connectMongo } from "@/lib/db/mongoose";
import { writeAuditEvent } from "@/lib/audit/log";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "security:read" });
    if ("error" in auth) return auth.error;

    await connectMongo();
    const incidents = await SecurityIncident.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      incidents: incidents.map((i) => ({
        id: String(i._id),
        incidentNumber: i.incidentNumber,
        title: i.title,
        severity: i.severity,
        status: i.status,
        detectedAt: i.detectedAt?.toISOString(),
        createdAt: i.createdAt?.toISOString(),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "security:manage" });
    if ("error" in auth) return auth.error;

    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const severity = String(body.severity ?? "medium");

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
    }

    await connectMongo();
    const incidentNumber = `INC-${Date.now()}`;

    const incident = await SecurityIncident.create({
      incidentNumber,
      title,
      description,
      severity,
      detectionSource: body.detectionSource ?? "manual",
      affectedSystems: body.affectedSystems ?? [],
      status: "open",
      createdByUserId: auth.sessionUserId,
    });

    await writeAuditEvent({
      action: "security.incident.created",
      targetType: "security_incident",
      targetId: incident._id,
      actorUserId: auth.sessionUserId,
      metadata: { incidentNumber, severity },
    });

    return NextResponse.json({
      id: String(incident._id),
      incidentNumber,
      status: incident.status,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
