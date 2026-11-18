import { describe, expect, it } from "vitest";
import { swiftDate } from "@/lib/contracts/lc-dates";
import { renderTemplateRich } from "@/lib/contracts/template-merge";
import { LC_WORDING_SKELETON_BLOCKS } from "@/lib/contracts/lc-wording-skeleton";

describe("LC wording fills in from the buyer's LC details", () => {
  it("writes dates the way SWIFT fields :31C: and :31D: expect", () => {
    expect(swiftDate(new Date("2026-12-05T00:00:00Z"))).toBe("20261205");
    expect(swiftDate("2027-01-31")).toBe("20270131");
    expect(swiftDate(undefined)).toBeUndefined();
    expect(swiftDate("not a date")).toBeUndefined();
  });

  it("prints the LC number, dates and country in black, and the rest stays red until filled", () => {
    const text = renderTemplateRich(LC_WORDING_SKELETON_BLOCKS, {
      lcNumber: "LC-778899",
      lcIssueDate: "20261205",
      lcExpiryDate: "20270605",
      lcExpiryCountry: "Canada",
    });
    expect(text).toContain("**:20:** DOCUMENTARY CREDIT NUMBER: LC-778899");
    expect(text).toContain("**:31C:** DATE OF ISSUE: 20261205");
    expect(text).toContain("**:31D:** DATE AND PLACE OF EXPIRY: 20270605 IN Canada");
    expect(text).toContain("[[YYYYMMDD]]"); // the latest date of shipment is still to be filled
  });

  it("the amount pattern of the LC form accepts a normal amount", () => {
    const pattern = /^\d+(\.\d{1,2})?$/;
    expect(pattern.test("250000.00")).toBe(true);
    expect(pattern.test("250000")).toBe(true);
    expect(pattern.test("250,000")).toBe(false);
  });
});
