import type { Address } from "viem";
import { contracts, UNISWAP_V2_FEE_BPS } from "@/config/contracts";
import type { SwapKind } from "@/types/swap";
import type { Token } from "@/types/token";
import { isNative, isSameAddress, isWeth } from "./token";

/** Чистые функции расчёта обмена. Без React и без сети, их легко тестировать. */

export function getSwapKind(tokenIn: Token, tokenOut: Token): SwapKind {
  if (isNative(tokenIn) && isWeth(tokenOut)) return "wrap";
  if (isWeth(tokenIn) && isNative(tokenOut)) return "unwrap";
  return "swap";
}

/** Пути-кандидаты: прямой и через WETH (если ни один из токенов не WETH). */
export function getCandidatePaths(from: Address, to: Address): Address[][] {
  const weth = contracts.weth.address;
  const paths: Address[][] = [[from, to]];
  if (!isSameAddress(from, weth) && !isSameAddress(to, weth)) {
    paths.push([from, weth, to]);
  }
  return paths;
}

/** Минимальная сумма к получению с учётом проскальзывания. */
export function applySlippage(amount: bigint, slippageBps: number): bigint {
  return (amount * BigInt(10_000 - slippageBps)) / 10_000n;
}

export interface HopReserves {
  reserveIn: bigint;
  reserveOut: bigint;
}

/**
 * Влияние на цену без учёта комиссии пула:
 * 1 - фактический выход / выход по mid-цене за вычетом комиссии.
 */
export function calcPriceImpact(amountIn: bigint, amountOut: bigint, hops: HopReserves[]): number {
  const feeMultiplier = Number(10_000n - UNISWAP_V2_FEE_BPS) / 10_000;
  let ideal = Number(amountIn);
  for (const { reserveIn, reserveOut } of hops) {
    ideal *= (Number(reserveOut) / Number(reserveIn)) * feeMultiplier;
  }
  if (ideal <= 0) return 0;
  return Math.max(0, 1 - Number(amountOut) / ideal);
}

/** Дедлайн транзакции: unix-время в секундах. */
export function getDeadline(minutes: number): bigint {
  return BigInt(Math.floor(Date.now() / 1000) + minutes * 60);
}
