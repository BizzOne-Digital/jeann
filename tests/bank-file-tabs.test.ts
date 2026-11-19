import { describe, expect, it } from "vitest";
import { bankFileTab, BANK_FILE_TABS } from "@/lib/banking/adviser-documents";

describe("bank file tabs", () => {
  it("numbers the tabs in a fixed order starting at 1", () => {
    expect(bankFileTab("sco").tabNumber).toBe(1);
    expect(bankFileTab("icpo").tabNumber).toBe(2);
    expect(bankFileTab("spa").tabNumber).toBe(3);
    expect(bankFileTab("proposed_lc_wording").tabNumber).toBe(4);
    expect(bankFileTab("proforma_invoice").tabNumber).toBe(5);
    expect(bankFileTab("letter_of_credit").tabNumber).toBe(6);
  });

  it("keeps the real Letter of Credit apart from the LC wording", () => {
    expect(bankFileTab("letter_of_credit").tabLabel).toBe("Letter of Credit (LC)");
    expect(bankFileTab("proposed_lc_wording").tabLabel).toBe("Proposed LC Wording");
  });

  it("puts unknown types in the last tab", () => {
    expect(bankFileTab("other")).toEqual({ tabNumber: BANK_FILE_TABS.length + 1, tabLabel: "Other documents" });
    expect(bankFileTab(undefined).tabNumber).toBe(BANK_FILE_TABS.length + 1);
  });
});
