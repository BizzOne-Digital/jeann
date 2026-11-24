import { describe, expect, it } from "vitest";
import {
  cleanDocumentDetails,
  documentDetailsSchemaFor,
  documentPrefillFromDetails,
  fieldsForKind,
} from "@/lib/organizations/document-details";

describe("organization document details", () => {
  it("offers bank fields only to suppliers and consignee fields only to the buyer side", () => {
    const supplier = fieldsForKind("supplier").map((f) => f.key);
    const buyer = fieldsForKind("buyer").map((f) => f.key);
    expect(supplier).toContain("sellerBankSwift");
    expect(supplier).not.toContain("consigneeCompany");
    expect(buyer).toContain("consigneeCompany");
    expect(buyer).not.toContain("sellerBankSwift");
    expect(fieldsForKind("agent").map((f) => f.key)).toContain("issuingBank");
  });

  it("keeps only the fields of that kind and drops empty values", () => {
    const clean = cleanDocumentDetails("buyer", { phone: " 123 ", sellerBankSwift: "X", email: "  ", junk: "y" });
    expect(clean).toEqual({ phone: "123" });
  });

  it("rejects unknown fields and over-long values", () => {
    const schema = documentDetailsSchemaFor("buyer");
    expect(schema.safeParse({ phone: "1", sellerBankAccount: "x" }).success).toBe(false);
    expect(schema.safeParse({ phone: "x".repeat(201) }).success).toBe(false);
    expect(schema.safeParse({ phone: "1", consigneeAddress: "a".repeat(400) }).success).toBe(true);
  });

  it("fills buyer keys on the buyer side and seller keys on the supplier side", () => {
    const d = { contactPerson: "A", phone: "1", email: "a@x.com", signatoryName: "B", signatoryTitle: "President", issuingBank: "Bank", sellerBankSwift: "SW" };
    expect(documentPrefillFromDetails(d, false)).toEqual({
      buyerContact: "A", buyerTelephone: "1", buyerEmail: "a@x.com", buyerSignatory: "B", buyerTitle: "President", issuingBank: "Bank",
    });
    const s = documentPrefillFromDetails(d, true);
    expect(s.sellerContact).toBe("A");
    expect(s.sellerRepresentative).toBe("B");
    expect(s.sellerBankSwift).toBe("SW");
    expect(s.buyerContact).toBeUndefined();
  });

  it("returns nothing when no details are saved", () => {
    expect(documentPrefillFromDetails(undefined, false)).toEqual({});
  });
});
