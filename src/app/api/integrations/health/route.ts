import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { getIntegrationHealthDashboard } from "@/lib/integrations/health-service";
import { listFeatureFlags, setFeatureFlag } from "@/lib/integrations/feature-flags";
import { completeIntegrationJob } from "@/lib/integrations/job-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "integrations:manage" });
    if ("error" in auth) return auth.error;

    const health = await getIntegrationHealthDashboard();
    return NextResponse.json(health);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const auth = await requireApiAuth({ permissions: "integrations:manage" });
    if ("error" in auth) return auth.error;

    if (body.action === "list_flags") {
      const flags = await listFeatureFlags();
      return NextResponse.json({ items: flags });
    }

    if (body.action === "set_flag") {
      await setFeatureFlag(body.key, Boolean(body.enabled), auth.sessionUserId);
      return NextResponse.json({ ok: true });
    }

    if (body.action === "retry_job") {
      const { IntegrationJob } = await import("@/models");
      const job = await IntegrationJob.findById(body.jobId);
      if (!job) return NextResponse.json({ error: "not_found" }, { status: 404 });
      job.status = "pending";
      job.scheduledAt = new Date();
      await job.save();
      return NextResponse.json({ jobId: String(job._id), status: job.status });
    }

    if (body.action === "dead_letter_job") {
      await completeIntegrationJob(body.jobId, false, body.reason ?? "manual_dead_letter");
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
