import { Alert } from "react-native";
import { parseSeconds } from "./time";

// Each validator returns an error message, or null when the value is fine.

export const validateInteger = (
  label: string,
  value: string,
  min: number,
  max: number
): string | null => {
  const text = String(value ?? "").trim();
  if (!text) return `${label} is required.`;
  if (!/^\d+$/.test(text)) return `${label} must be a whole number.`;
  const n = parseInt(text, 10);
  if (n < min || n > max) return `${label} must be between ${min} and ${max}.`;
  return null;
};

// Time in seconds. Accepts ".5", ".4", "0.5", "1.5", "2". `maxDecimals` limits precision (quizzes tick at 0.1s).
export const validateSecondsField = (
  label: string,
  value: string,
  min: number,
  max: number,
  maxDecimals?: number
): string | null => {
  const text = String(value ?? "").trim();
  if (!text) return `${label} is required.`;
  const n = parseSeconds(text);
  if (isNaN(n)) return `${label} must be a number like 5, 1.5 or .5.`;
  if (n < min || n > max) return `${label} must be between ${min} and ${max} seconds.`;
  if (maxDecimals !== undefined) {
    const decimals = (text.split(/[.,]/)[1] ?? "").length;
    if (decimals > maxDecimals) {
      return `${label} can have at most ${maxDecimals} decimal place${maxDecimals === 1 ? "" : "s"} (e.g. 0.5).`;
    }
  }
  return null;
};

// Shows the first error as an alert. Returns true when everything is valid.
export const checkFields = (errors: (string | null)[]): boolean => {
  const first = errors.find((e) => e !== null);
  if (first) {
    Alert.alert("Invalid input", first as string);
    return false;
  }
  return true;
};

export const MAX_QUESTIONS = 100000; // hard ceiling for typed counts; the dropdown list itself stops at 100
export const MAX_QUIZ_SECONDS = 300;
export const MAX_INTERVAL_SECONDS = 60;
export const MIN_SECONDS = 0.1;
