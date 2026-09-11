import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashIp, saveLead } from "@/lib/leads/store";
import { persistLeadToMongo } from "@/lib/leads/persist";
import { CAREER_RESUME_MAX_BYTES, UPLOAD_MIME_TYPES } from "@/lib/uploads/constants";
import { saveStoredUpload } from "@/lib/uploads/stored-upload-service";

const careerFieldsSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().min(7).max(40),
  position: z.string().min(2).max(160),
  linkedIn: z
    .string()
    .max(300)
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined))
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: "Enter a valid LinkedIn URL.",
    }),
  location: z.string().max(160).optional(),
  coverLetter: z.string().max(6000).optional(),
  consent: z.literal("true"),
  website: z.string().max(0).optional(),
});

const RESUME_MIMES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")
  );
}

export async function POST(request: NextRequest) {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    if (formData.get("website")) {
      return NextResponse.json({ ok: true }, { status: 202 });
    }

    const parsed = careerFieldsSchema.safeParse({
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      position: String(formData.get("position") ?? "").trim(),
      linkedIn: String(formData.get("linkedIn") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      coverLetter: String(formData.get("coverLetter") ?? "").trim(),
      consent: String(formData.get("consent") ?? ""),
      website: String(formData.get("website") ?? ""),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please correct the highlighted information.", issues: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const resume = formData.get("resume");
    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json({ error: "Resume file is required." }, { status: 422 });
    }

    const mimeType = resume.type || "application/octet-stream";
    if (!RESUME_MIMES.has(mimeType) || !UPLOAD_MIME_TYPES[mimeType]) {
      return NextResponse.json(
        { error: "Resume must be PDF, DOC, or DOCX." },
        { status: 422 },
      );
    }

    if (resume.size > CAREER_RESUME_MAX_BYTES) {
      return NextResponse.json({ error: "Resume must be 5MB or smaller." }, { status: 422 });
    }

    const buffer = Buffer.from(await resume.arrayBuffer());
    const saved = await saveStoredUpload({ folder: "careers", mimeType, buffer });
    if (!saved) {
      return NextResponse.json({ error: "Unable to store resume. Try again later." }, { status: 503 });
    }

    const data = {
      ...parsed.data,
      linkedIn: parsed.data.linkedIn || undefined,
      location: parsed.data.location || undefined,
      coverLetter: parsed.data.coverLetter || undefined,
      resumeUrl: saved.url,
      resumeFilename: resume.name,
      resumeMimeType: mimeType,
      resumeSize: saved.size,
    };

    const ip = clientIp(request);
    const mongoId = await persistLeadToMongo("career", data, ip);
    const lead = await saveLead("career", data, ip);

    return NextResponse.json({ ok: true, id: mongoId || lead.id }, { status: 201 });
  } catch (error) {
    console.error("[leads/career]", error);
    return NextResponse.json({ error: "Unable to process this application." }, { status: 400 });
  }
}
