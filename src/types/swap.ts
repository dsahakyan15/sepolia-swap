import type { Address } from "viem";

/**
 * wrap / unwrap: ETH <-> WETH напрямую через контракт WETH, курс 1:1
 * swap: обмен через Uniswap V2 Router
 */
export type SwapKind = "wrap" | "unwrap" | "swap";

export interface SwapQuote {
  kind: SwapKind;
  amountIn: bigint;
  amountOut: bigint;
  /** Путь по адресам ERC-20 (ETH уже заменён на WETH). Пустой для wrap/unwrap. */
  path: Address[];
  /** Влияние на цену, доля от 0 до 1. null, если посчитать не удалось. */
  priceImpact: number | null;
}

export interface SwapSettings {
  /** Проскальзывание в базисных пунктах (50 = 0.5%) */
  slippageBps: number;
  /** Дедлайн транзакции в минутах */
  deadlineMinutes: number;
}
