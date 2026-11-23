import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { getSwapQuote } from "@/services/quote";
import type { Token } from "@/types/token";

/**
 * Котировка обмена. Обновляется каждые 15 секунд.
 * data === null означает, что ликвидности нет.
 */
export function useSwapQuote(tokenIn: Token, tokenOut: Token, amountIn: bigint | null) {
  const client = usePublicClient();

  return useQuery({
    queryKey: ["swapQuote", tokenIn.address, tokenOut.address, amountIn?.toString()],
    queryFn: () => getSwapQuote(client!, tokenIn, tokenOut, amountIn!),
    enabled: !!client && !!amountIn,
    refetchInterval: 15_000,
  });
}
