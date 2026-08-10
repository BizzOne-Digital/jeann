import { describe, expect, it } from "vitest";
import { addMoney, applyTaxAmount, formatMoney, money } from "@/lib/finance/money";

describe("money helpers", () => {
  it("avoids binary float drift for currency math", () => {
    const total = addMoney("0.1", "0.2");
    expect(total.toFixed(2)).toBe("0.30");
    expect(formatMoney(total, "USD")).toBe("USD 0.30");
  });

  it("applies configurable HST example rate", () => {
    const { tax, total } = applyTaxAmount("1000.00", "13");
    expect(tax.toFixed(2)).toBe("130.00");
    expect(total.toFixed(2)).toBe("1130.00");
    expect(money("13").toString()).toBe("13");
  });
});
