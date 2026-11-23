import { formatUnits, parseUnits } from "viem";

/** bigint -> строка с ограничением знаков после точки, без хвостовых нулей. */
export function formatAmount(value: bigint, decimals: number, maxFractionDigits = 6): string {
  const [int, frac = ""] = formatUnits(value, decimals).split(".");
  const trimmed = frac.slice(0, maxFractionDigits).replace(/0+$/, "");
  return trimmed ? `${int}.${trimmed}` : (int ?? "0");
}

/** Пользовательский ввод -> bigint. null, если ввод пустой, некорректный или равен нулю. */
export function parseAmount(input: string, decimals: number): bigint | null {
  const value = input.trim().replace(",", ".");
  if (!/^\d*\.?\d*$/.test(value) || value === "" || value === ".") return null;

  const [int = "", frac = ""] = value.split(".");
  try {
    const parsed = parseUnits(`${int || "0"}.${frac.slice(0, decimals) || "0"}`, decimals);
    return parsed > 0n ? parsed : null;
  } catch {
    return null;
  }
}

/** Оставляет в строке ввода только цифры и одну точку. */
export function sanitizeAmountInput(input: string): string {
  return input
    .replace(",", ".")
    .replace(/[^\d.]/g, "")
    .replace(/(\..*)\./g, "$1");
}

export const shortenAddress = (address: string, chars = 4): string =>
  `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;

export function formatPercent(fraction: number): string {
  const pct = fraction * 100;
  if (pct > 0 && pct < 0.01) return "<0.01%";
  return `${pct.toFixed(2)}%`;
}

export const bpsToPercent = (bps: number): number => bps / 100;
export const percentToBps = (pct: number): number => Math.round(pct * 100);
