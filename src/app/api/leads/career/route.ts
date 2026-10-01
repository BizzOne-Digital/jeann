import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { hashIp, saveLead } from "@/lib/leads/store";
import { persistLeadToMongo } from "@/lib/leads/persist";
import { CAREER_RESUME_MAX_BYTES, UPLOAD_MIME_TYPES } from "@/lib/uploads/constants";
import { saveStoredUpload } from "@/lib/uploads/stored-upload-service";
import {
  careerApplicationFieldsSchema,
  parseCareerCheckboxList,
} from "@/lib/validation/career-application";

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

function optionalField(value: FormDataEntryValue | null): string | undefined {
  const trimmed = String(value ?? "").trim();
  return trimmed ? trimmed : undefined;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Sign in to your career portal account before submitting." },
        { status: 401 },
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    if (formData.get("website")) {
      return NextResponse.json({ ok: true }, { status: 202 });
    }

    const parsed = careerApplicationFieldsSchema.safeParse({
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      educationHighest: String(formData.get("educationHighest") ?? "").trim(),
      educationField: String(formData.get("educationField") ?? "").trim(),
      educationInstitution: String(formData.get("educationInstitution") ?? "").trim(),
      educationCountryYear: String(formData.get("educationCountryYear") ?? "").trim(),
      educationCertifications: optionalField(formData.get("educationCertifications")),
      expRecentTitle: String(formData.get("expRecentTitle") ?? "").trim(),
      expRecentCompany: String(formData.get("expRecentCompany") ?? "").trim(),
      expRecentStart: String(formData.get("expRecentStart") ?? "").trim(),
      expRecentEnd: String(formData.get("expRecentEnd") ?? "").trim(),
      expRecentDetails: String(formData.get("expRecentDetails") ?? "").trim(),
      expPrevTitle: optionalField(formData.get("expPrevTitle")),
      expPrevCompany: optionalField(formData.get("expPrevCompany")),
      expPrevStart: optionalField(formData.get("expPrevStart")),
      expPrevEnd: optionalField(formData.get("expPrevEnd")),
      expPrevDetails: optionalField(formData.get("expPrevDetails")),
      employmentStatus: String(formData.get("employmentStatus") ?? "").trim(),
      currentLocation: String(formData.get("currentLocation") ?? "").trim(),
      workAuthorization: String(formData.get("workAuthorization") ?? "").trim(),
      startDate: String(formData.get("startDate") ?? "").trim(),
      salaryExpectation: String(formData.get("salaryExpectation") ?? "").trim(),
      tradeFinance: String(formData.get("tradeFinance") ?? "").trim(),
      logisticsScenario: String(formData.get("logisticsScenario") ?? "").trim(),
      qualityControl: String(formData.get("qualityControl") ?? "").trim(),
      commodityFamiliarity: parseCareerCheckboxList(formData, "commodityFamiliarity"),
      tradeDocuments: parseCareerCheckboxList(formData, "tradeDocuments"),
      accuracyCertified: String(formData.get("accuracyCertified") ?? ""),
      consent: String(formData.get("consent") ?? ""),
      website: String(formData.get("website") ?? ""),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please correct the highlighted information.", issues: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const sessionEmail = session.user.email?.toLowerCase();
    if (sessionEmail && parsed.data.email.toLowerCase() !== sessionEmail) {
      return NextResponse.json(
        { error: "Application email must match your signed-in career portal account." },
        { status: 422 },
      );
    }

    const dossier = formData.get("dossier") ?? formData.get("resume");
    if (!(dossier instanceof File) || dossier.size === 0) {
      return NextResponse.json({ error: "Candidate dossier file is required." }, { status: 422 });
    }

    const mimeType = dossier.type || "application/octet-stream";
    if (!RESUME_MIMES.has(mimeType) || !UPLOAD_MIME_TYPES[mimeType]) {
      return NextResponse.json(
        { error: "Dossier must be PDF, DOC, or DOCX." },
        { status: 422 },
      );
    }

    if (dossier.size > CAREER_RESUME_MAX_BYTES) {
      return NextResponse.json({ error: "Dossier must be 15MB or smaller." }, { status: 422 });
    }

    const buffer = Buffer.from(await dossier.arrayBuffer());
    const saved = await saveStoredUpload({ folder: "careers", mimeType, buffer });
    if (!saved) {
      return NextResponse.json({ error: "Unable to store dossier. Try again later." }, { status: 503 });
    }

    const prev =
      parsed.data.expPrevTitle &&
      parsed.data.expPrevCompany &&
      parsed.data.expPrevStart &&
      parsed.data.expPrevEnd &&
      parsed.data.expPrevDetails
        ? {
            jobTitle: parsed.data.expPrevTitle,
            companyName: parsed.data.expPrevCompany,
            startDate: parsed.data.expPrevStart,
            endDate: parsed.data.expPrevEnd,
            details: parsed.data.expPrevDetails,
          }
        : undefined;

    const questionnaire = {
      education: {
        highestLevel: parsed.data.educationHighest,
        fieldOfStudy: parsed.data.educationField,
        institution: parsed.data.educationInstitution,
        countryGraduation: parsed.data.educationCountryYear,
        certifications: parsed.data.educationCertifications,
      },
      experience: {
        recent: {
          jobTitle: parsed.data.expRecentTitle,
          companyName: parsed.data.expRecentCompany,
          startDate: parsed.data.expRecentStart,
          endDate: parsed.data.expRecentEnd,
          details: parsed.data.expRecentDetails,
        },
        previous: prev,
      },
      hr: {
        employmentStatus: parsed.data.employmentStatus,
        currentLocation: parsed.data.currentLocation,
        workAuthorization: parsed.data.workAuthorization,
        startDate: parsed.data.startDate,
        salaryExpectation: parsed.data.salaryExpectation,
        commodityFamiliarity: parsed.data.commodityFamiliarity,
        tradeDocuments: parsed.data.tradeDocuments,
        tradeFinance: parsed.data.tradeFinance,
        logisticsScenario: parsed.data.logisticsScenario,
        qualityControl: parsed.data.qualityControl,
      },
      accuracyCertified: true,
    };

    const data = {
      applicantUserId: session.userId,
      fullName: parsed.data.fullName,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      position: "Career portal application",
      location: parsed.data.currentLocation,
      questionnaire,
      resumeUrl: saved.url,
      resumeFilename: dossier.name,
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
