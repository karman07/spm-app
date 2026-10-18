// Strict decimal: "5", "5.", ".5", "0.5", "0,5" (comma keyboards). Rejects "5abc", "1.2.3", "-1", "".
const DECIMAL_RE = /^(\d+([.,]\d*)?|[.,]\d+)$/;

// Parses a user-entered seconds value. Returns NaN for empty, malformed or non-positive input.
// `step` rounds to that resolution (never below one step).
export const parseSeconds = (value: string, step?: number): number => {
  const text = String(value ?? "").trim();
  if (!DECIMAL_RE.test(text)) return NaN;
  const n = parseFloat(text.replace(",", "."));
  if (!isFinite(n) || n <= 0) return NaN;
  if (!step) return n;
  return Math.max(step, Math.round(n / step) * step);
};

export const QUIZ_TICK_SECONDS = 0.1;

// Countdown helper: subtract one tick without floating point drift (e.g. 0.30000000000000004).
export const tickDown = (value: number): number =>
  Math.round((value - QUIZ_TICK_SECONDS) * 10) / 10;

export const formatSeconds = (n: number): string =>
  Number.isInteger(n) ? String(n) : n.toFixed(1);
