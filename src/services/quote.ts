import type { PublicClient } from "viem";
import { getSwapKind } from "@/lib/swap";
import { toPathAddress } from "@/lib/token";
import type { SwapQuote } from "@/types/swap";
import type { Token } from "@/types/token";
import { getBestRoute } from "./uniswapV2";

/**
 * Котировка для пары токенов.
 * Возвращает null, если для обмена нет ликвидности.
 */
export async function getSwapQuote(
  client: PublicClient,
  tokenIn: Token,
  tokenOut: Token,
  amountIn: bigint,
): Promise<SwapQuote | null> {
  const kind = getSwapKind(tokenIn, tokenOut);

  if (kind !== "swap") {
    return { kind, amountIn, amountOut: amountIn, path: [], priceImpact: 0 };
  }

  const route = await getBestRoute(client, amountIn, toPathAddress(tokenIn), toPathAddress(tokenOut));
  if (!route) return null;

  return { kind, amountIn, amountOut: route.amountOut, path: route.path, priceImpact: route.priceImpact };
}
