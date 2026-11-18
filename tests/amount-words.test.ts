import { describe, expect, it } from "vitest";
import { amountInWords, numberToWords } from "@/lib/finance/amount-words";

describe("amount in words", () => {
  it("writes whole numbers in capital letters", () => {
    expect(numberToWords(0)).toBe("ZERO");
    expect(numberToWords(21)).toBe("TWENTY-ONE");
    expect(numberToWords(105)).toBe("ONE HUNDRED FIVE");
    expect(numberToWords(71200000)).toBe("SEVENTY-ONE MILLION TWO HUNDRED THOUSAND");
    expect(numberToWords(1000001)).toBe("ONE MILLION ONE");
  });

  it("writes an invoice amount with its currency and cents", () => {
    expect(amountInWords("USD 284,800,000.00")).toBe("TWO HUNDRED EIGHTY-FOUR MILLION EIGHT HUNDRED THOUSAND US DOLLARS");
    expect(amountInWords("12,500.50", "USD")).toBe("TWELVE THOUSAND FIVE HUNDRED US DOLLARS AND 50/100");
    expect(amountInWords("")).toBe("");
  });
});
