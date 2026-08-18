import { describe, expect, it } from "vitest";
import { purchaseRequestSchema, contactSchema } from "@/lib/validation/forms";
import { validateUpload } from "@/lib/documents/file-validation";

describe("lead validation", () => {
  it("requires terms acceptance on RFQ", () => {
    const parsed = purchaseRequestSchema.safeParse({
      companyName: "Demo Buyer LLC",
      contactName: "Alex Buyer",
      email: "alex@example.com",
      phone: "4165550100",
      lineItems: [
        {
          productName: "Canola oil",
          quantity: "1000",
          unit: "MT",
          packaging: "Flexitank",
        },
      ],
      destinationCountry: "Canada",
      incoterm: "CIF",
      acceptTerms: false,
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects honeypot contact spam", () => {
    const parsed = contactSchema.safeParse({
      name: "Bot",
      email: "bot@example.com",
      department: "General",
      message: "Hello there this is long enough",
      consent: true,
      website: "http://spam.test",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("upload validation", () => {
  it("allows pdf magic bytes and rejects exe", () => {
    const pdf = validateUpload({
      filename: "spa.pdf",
      mimeType: "application/pdf",
      size: 8,
      buffer: Buffer.from("%PDF-1.4"),
    });
    expect(pdf.ok).toBe(true);

    const exe = validateUpload({
      filename: "x.exe",
      mimeType: "application/octet-stream",
      size: 8,
      buffer: Buffer.from("MZ******"),
    });
    expect(exe.ok).toBe(false);
  });
});
