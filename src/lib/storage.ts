/** Безопасная работа с localStorage (в приватном режиме он может бросать исключения). */

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export const STORAGE_KEYS = {
  customTokens: "sepolia-swap:custom-tokens",
  swapSettings: "sepolia-swap:settings",
} as const;
