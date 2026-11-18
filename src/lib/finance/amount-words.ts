const ONES = [
  "ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN",
  "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN",
];
const TENS = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];
const SCALES = ["", "THOUSAND", "MILLION", "BILLION", "TRILLION"];

function underThousand(n: number): string {
  const parts: string[] = [];
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds) parts.push(ONES[hundreds] + " HUNDRED");
  if (rest) {
    if (rest < 20) parts.push(ONES[rest]);
    else parts.push(TENS[Math.floor(rest / 10)] + (rest % 10 ? "-" + ONES[rest % 10] : ""));
  }
  return parts.join(" ");
}

/** A whole number in English capital letters, for example 71200000 gives SEVENTY-ONE MILLION TWO HUNDRED THOUSAND. */
export function numberToWords(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "";
  const n = Math.floor(value);
  if (n === 0) return ONES[0];
  const groups: string[] = [];
  let rest = n;
  let scale = 0;
  while (rest > 0 && scale < SCALES.length) {
    const chunk = rest % 1000;
    if (chunk) groups.unshift(underThousand(chunk) + (SCALES[scale] ? " " + SCALES[scale] : ""));
    rest = Math.floor(rest / 1000);
    scale += 1;
  }
  return groups.join(" ");
}

const CURRENCY_NAMES: Record<string, string> = {
  USD: "US DOLLARS",
  EUR: "EUROS",
  CAD: "CANADIAN DOLLARS",
  GBP: "POUNDS STERLING",
};

/**
 * An amount in words for an invoice: "USD 71,200,000.00" becomes
 * "SEVENTY-ONE MILLION TWO HUNDRED THOUSAND US DOLLARS". Cents are added as "AND 50/100" when not zero.
 */
export function amountInWords(amount: string | number, currency = "USD"): string {
  const cleaned = typeof amount === "number" ? String(amount) : amount.replace(/[^\d.]/g, "");
  if (!cleaned) return "";
  const [whole, fraction = ""] = cleaned.split(".");
  const dollars = Number(whole);
  if (!Number.isFinite(dollars)) return "";
  const cents = Number((fraction + "00").slice(0, 2));
  const name = CURRENCY_NAMES[currency.toUpperCase()] ?? currency.toUpperCase();
  return numberToWords(dollars) + " " + name + (cents ? " AND " + String(cents).padStart(2, "0") + "/100" : "");
}
