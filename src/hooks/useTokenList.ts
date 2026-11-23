import { useCallback, useMemo } from "react";
import { DEFAULT_TOKENS } from "@/config/tokens";
import { STORAGE_KEYS } from "@/lib/storage";
import { isSameAddress } from "@/lib/token";
import type { Token } from "@/types/token";
import { useLocalStorage } from "./useLocalStorage";

/** Токены по умолчанию плюс импортированные пользователем (хранятся в localStorage). */
export function useTokenList() {
  const [customTokens, setCustomTokens] = useLocalStorage<Token[]>(STORAGE_KEYS.customTokens, []);

  const tokens = useMemo(
    () => [
      ...DEFAULT_TOKENS,
      ...customTokens.filter((c) => !DEFAULT_TOKENS.some((d) => isSameAddress(d.address, c.address))),
    ],
    [customTokens],
  );

  const addToken = useCallback(
    (token: Token) => {
      setCustomTokens((prev) =>
        prev.some((t) => isSameAddress(t.address, token.address)) ? prev : [...prev, { ...token, isCustom: true }],
      );
    },
    [setCustomTokens],
  );

  const removeToken = useCallback(
    (address: string) => setCustomTokens((prev) => prev.filter((t) => !isSameAddress(t.address, address))),
    [setCustomTokens],
  );

  return { tokens, addToken, removeToken };
}
