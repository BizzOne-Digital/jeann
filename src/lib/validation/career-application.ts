import { z } from "zod";
import {
  COMMODITY_FAMILIARITY_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  TRADE_DOCUMENT_OPTIONS,
  WORK_AUTHORIZATION_OPTIONS,
} from "@/lib/content/careers-page-content";

const educationLevel = z.enum(EDUCATION_LEVEL_OPTIONS);
const employmentStatus = z.enum(EMPLOYMENT_STATUS_OPTIONS);
const workAuthorization = z.enum(WORK_AUTHORIZATION_OPTIONS);

export const careerApplicationFieldsSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  phone: z.string().trim().min(7).max(40),
  educationHighest: educationLevel,
  educationField: z.string().trim().min(2).max(200),
  educationInstitution: z.string().trim().min(2).max(200),
  educationCountryYear: z.string().trim().min(4).max(120),
  educationCertifications: z.string().trim().max(500).optional(),
  expRecentTitle: z.string().trim().min(2).max(160),
  expRecentCompany: z.string().trim().min(2).max(200),
  expRecentStart: z.string().trim().min(4).max(40),
  expRecentEnd: z.string().trim().min(2).max(40),
  expRecentDetails: z.string().trim().min(20).max(4000),
  expPrevTitle: z.string().trim().max(160).optional(),
  expPrevCompany: z.string().trim().max(200).optional(),
  expPrevStart: z.string().trim().max(40).optional(),
  expPrevEnd: z.string().trim().max(40).optional(),
  expPrevDetails: z.string().trim().max(4000).optional(),
  employmentStatus: employmentStatus,
  currentLocation: z.string().trim().min(3).max(200),
  workAuthorization: workAuthorization,
  startDate: z.string().trim().min(4).max(40),
  salaryExpectation: z.string().trim().min(1).max(80),
  tradeFinance: z.string().trim().min(10).max(2000),
  logisticsScenario: z.string().trim().min(20).max(1800),
  qualityControl: z.string().trim().min(20).max(1500),
  commodityFamiliarity: z
    .array(z.enum(COMMODITY_FAMILIARITY_OPTIONS))
    .min(1, "Select at least one commodity group."),
  tradeDocuments: z.array(z.enum(TRADE_DOCUMENT_OPTIONS)).min(1, "Select at least one document type."),
  accuracyCertified: z.literal("true"),
  consent: z.literal("true"),
  website: z.string().max(0).optional(),
});

export type CareerApplicationFields = z.infer<typeof careerApplicationFieldsSchema>;

export function parseCareerCheckboxList(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .map((v) => String(v).trim())
    .filter(Boolean);
}
