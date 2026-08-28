import { describe, expect, it } from "vitest";
import {
  findProcurementTransition,
  allowedProcurementTransitionsFrom,
  PROCUREMENT_STATUS_LABELS,
} from "@/lib/transactions/procurement-workflow";
import {
  parseTransactionNumber,
  parseDealGroupNumber,
} from "@/lib/transactions/number";
import { evaluateSpecificationCompatibility } from "@/lib/transactions/deal-group-service";

describe("Phase 4 procurement workflow", () => {
  it("defines procurement status labels", () => {
    expect(PROCUREMENT_STATUS_LABELS.offer_pending).toBe("Offer Pending");
    expect(PROCUREMENT_STATUS_LABELS.instrument_issuance_requested).toBe(
      "Instrument Issuance Requested",
    );
  });

  it("allows offer draft to offer under review", () => {
    const t = findProcurementTransition("offer_draft", "offer_under_review");
    expect(t?.permission).toBe("transactions:write");
  });

  it("blocks arbitrary procurement transitions", () => {
    expect(findProcurementTransition("draft", "contract_executed")).toBeUndefined();
  });

  it("lists transitions from offer_pending", () => {
    const next = allowedProcurementTransitionsFrom("offer_pending");
    expect(next.some((t) => t.to === "offer_draft")).toBe(true);
  });

  it("parses FK-P transaction numbers", () => {
    const parsed = parseTransactionNumber("FK-P-2026-000001");
    expect(parsed?.side).toBe("P");
    expect(parsed?.year).toBe(2026);
    expect(parsed?.sequence).toBe(1);
  });

  it("parses FK-DG deal group numbers", () => {
    const parsed = parseDealGroupNumber("FK-DG-2026-000001");
    expect(parsed?.year).toBe(2026);
    expect(parsed?.sequence).toBe(1);
  });
});

describe("Specification compatibility without DB", () => {
  it("returns incompatible when transactions missing", async () => {
    const result = await evaluateSpecificationCompatibility({
      buyerTransactionId: "000000000000000000000000",
      supplierTransactionId: "000000000000000000000001",
    });
    expect(result.status).toBe("incompatible");
  });
});

describe("Buyer vs supplier isolation rules", () => {
  it("buyer and supplier transaction types are distinct", () => {
    expect(parseTransactionNumber("FK-S-2026-000001")?.side).toBe("S");
    expect(parseTransactionNumber("FK-P-2026-000001")?.side).toBe("P");
  });
});

describe("Procurement signing order", () => {
  it("requires Finekarts signature before supplier", () => {
    const finekartsFirst = findProcurementTransition(
      "awaiting_finekarts_signature",
      "awaiting_supplier_signature",
    );
    expect(finekartsFirst).toBeDefined();
    const supplierSign = findProcurementTransition(
      "awaiting_supplier_signature",
      "contract_executed",
    );
    expect(supplierSign).toBeDefined();
  });
});

describe("Banking instrument selection permission", () => {
  it("requires banking:select for issuance requested", () => {
    const t = findProcurementTransition("banking_setup", "instrument_issuance_requested");
    expect(t?.permission).toBe("banking:select");
  });
});
