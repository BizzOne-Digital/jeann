import { describe, expect, it } from "vitest";
import { compareShippingDocumentFields, compareToLotReference } from "@/lib/shipments/cross-document-checks";
import { canConfirmPayment, derivePaymentStage } from "@/lib/banking/courier-service";
import { SHIPPING_DOCUMENT_CATALOGUE } from "@/lib/shipments/checklist-service";
import { buildAdviserDocumentRow, isBankingAdviserDocument } from "@/lib/banking/adviser-documents";

describe("cross-document checks", () => {
  it("flags a missing comma in consignee as blocking", () => {
    const f = compareShippingDocumentFields([
      { documentType: "commercial_invoice", consignee: "Acme Trading, LLC" },
      { documentType: "ocean_bill_of_lading", consignee: "Acme Trading LLC" },
    ]);
    expect(f).toHaveLength(1);
    expect(f[0].severity).toBe("blocking");
    expect(f[0].message).toContain("first difference");
  });
  it("treats case/space only differences as warnings", () => {
    const f = compareShippingDocumentFields([
      { documentType: "a", blNumber: "ABC 123" },
      { documentType: "b", blNumber: "ABC  123" },
    ]);
    expect(f[0].severity).toBe("warning");
  });
  it("flags amount and quantity mismatch and skips missing data", () => {
    const f = compareShippingDocumentFields([
      { documentType: "a", amount: "1000.00", quantity: 50, quantityUnit: "MT" },
      { documentType: "b", amount: 1000, quantity: 50, quantityUnit: "MT" },
      { documentType: "c", amount: 999, quantity: 49, quantityUnit: "MT" },
      { documentType: "d" },
    ]);
    expect(f.map((x) => x.field).sort()).toEqual(["amount", "quantity"]);
  });
  it("flags shipped-on-board after issue date", () => {
    const f = compareShippingDocumentFields([
      { documentType: "bl", issueDate: "2026-01-01", shippedOnBoardDate: "2026-01-05" },
    ]);
    expect(f[0].field).toBe("shippedOnBoardDate");
  });
  it("compares to lot reference", () => {
    const f = compareToLotReference([{ documentType: "bl", portOfDischarge: "Rotterdam" }], {
      portOfDischarge: "Montreal",
    });
    expect(f[0].severity).toBe("blocking");
  });
});

describe("catalogue and banking flow", () => {
  it("includes client shipping documents", () => {
    for (const k of ["air_waybill", "mates_receipt", "importer_security_filing", "safety_data_sheet", "bill_of_exchange"]) {
      expect(k in SHIPPING_DOCUMENT_CATALOGUE).toBe(true);
    }
  });
  it("payment requires verified authenticity", () => {
    expect(canConfirmPayment("pending")).toBe(false);
    expect(canConfirmPayment("verified_authentic")).toBe(true);
    expect(derivePaymentStage({ status: "delivered", verificationStatus: "pending" })).toBe("received_by_buyer_bank");
  });
  it("adviser documents need release and carry step identification", () => {
    expect(isBankingAdviserDocument({ documentType: "icpo", workflowStatus: "draft" })).toBe(false);
    expect(isBankingAdviserDocument({ documentType: "icpo", workflowStatus: "sent" })).toBe(true);
    const row = buildAdviserDocumentRow(
      { _id: "1", transactionId: "t", documentType: "spa", stepKey: "psa_lc", title: "PSA", workflowStatus: "signed" },
      { side: "buyer_sale", transactionNumber: "FK-S-1", filename: "x.pdf" },
    );
    expect(row.stepNumber).toBe(3);
    expect(row.isPdf).toBe(true);
  });
});
