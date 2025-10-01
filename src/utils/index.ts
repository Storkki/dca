import { Row, DecimalSeparator } from "../types";

// Formatting utilities
export function toFixedWithSep(
  n: number,
  decimals: number,
  decimalSep: DecimalSeparator = "."
): string {
  if (!isFinite(n)) return "-";
  const s = n.toFixed(decimals);
  return decimalSep === "," ? s.replace(".", ",") : s;
}

export function createFormatter(
  priceDecimals: number,
  decimalSep: DecimalSeparator
) {
  const fmtPrice = (n: number, withSymbol?: string) =>
    withSymbol
      ? `${withSymbol}${toFixedWithSep(n, priceDecimals, decimalSep)}`
      : toFixedWithSep(n, priceDecimals, decimalSep);

  const fmtOther = (n: number, withSymbol?: string) =>
    withSymbol
      ? `${withSymbol}${toFixedWithSep(n, 1, decimalSep)}`
      : toFixedWithSep(n, 1, decimalSep);

  return { fmtPrice, fmtOther };
}

// Clipboard utilities
export function copyText(text: string): void {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text: string): void {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
  } catch {}
  document.body.removeChild(ta);
}

// CSV utilities
export function generateCSV(
  rows: Row[],
  decimalSep: DecimalSeparator,
  priceDecimals: number
): string {
  const headers = [
    "Order",
    "Price",
    "Size ($)",
    "Size (Token)",
    "Cum.size (Token)",
    "Cum.size ($)",
    "Avg Price",
    "TP Price",
    "Profit ($)",
  ];

  const lines = rows.map((r) => [
    r.order,
    toFixedWithSep(r.price, priceDecimals, decimalSep),
    toFixedWithSep(r.usd, 1, decimalSep),
    toFixedWithSep(r.tokens, 1, decimalSep),
    toFixedWithSep(r.cumTokens, 1, decimalSep),
    toFixedWithSep(r.cumUsd, 1, decimalSep),
    toFixedWithSep(r.avgPrice, priceDecimals, decimalSep),
    toFixedWithSep(r.tpPrice, priceDecimals, decimalSep),
    toFixedWithSep(r.stepProfit, 1, decimalSep),
  ]);

  const delimiter = decimalSep === "," ? ";" : ",";
  return [headers, ...lines]
    .map((arr) =>
      arr
        .map((v) =>
          typeof v === "string"
            ? '"' + v.replaceAll('"', '""') + '"'
            : String(v)
        )
        .join(delimiter)
    )
    .join("\n");
}

export function downloadCSV(
  csv: string,
  filename: string = "grid_calculator.csv"
): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
