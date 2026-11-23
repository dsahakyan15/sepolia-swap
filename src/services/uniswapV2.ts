import { zeroAddress, type Address, type PublicClient } from "viem";
import { uniswapV2PairAbi } from "@/abi";
import { contracts } from "@/config/contracts";
import { calcPriceImpact, getCandidatePaths, type HopReserves } from "@/lib/swap";
import { isSameAddress } from "@/lib/token";

/** Чтение данных Uniswap V2 из блокчейна. Функции принимают PublicClient и не зависят от React. */

export async function getAmountsOut(
  client: PublicClient,
  amountIn: bigint,
  path: Address[],
): Promise<readonly bigint[]> {
  return client.readContract({
    ...contracts.uniswapV2Router,
    functionName: "getAmountsOut",
    args: [amountIn, path],
  });
}

export async function getPairAddress(client: PublicClient, tokenA: Address, tokenB: Address): Promise<Address | null> {
  const pair = await client.readContract({
    ...contracts.uniswapV2Factory,
    functionName: "getPair",
    args: [tokenA, tokenB],
  });
  return pair === zeroAddress ? null : pair;
}

/** Резервы пары, упорядоченные по направлению обмена (tokenIn -> tokenOut). */
export async function getHopReserves(
  client: PublicClient,
  tokenIn: Address,
  tokenOut: Address,
): Promise<HopReserves | null> {
  const pair = await getPairAddress(client, tokenIn, tokenOut);
  if (!pair) return null;

  const [[reserve0, reserve1], token0] = await Promise.all([
    client.readContract({ address: pair, abi: uniswapV2PairAbi, functionName: "getReserves" }),
    client.readContract({ address: pair, abi: uniswapV2PairAbi, functionName: "token0" }),
  ]);
  if (reserve0 === 0n || reserve1 === 0n) return null;

  return isSameAddress(token0, tokenIn)
    ? { reserveIn: reserve0, reserveOut: reserve1 }
    : { reserveIn: reserve1, reserveOut: reserve0 };
}

export interface RouteQuote {
  path: Address[];
  amountOut: bigint;
  priceImpact: number | null;
}

/**
 * Лучший маршрут между двумя ERC-20 (прямой или через WETH).
 * null, если ликвидности нет ни на одном маршруте.
 */
export async function getBestRoute(
  client: PublicClient,
  amountIn: bigint,
  from: Address,
  to: Address,
): Promise<RouteQuote | null> {
  const results = await Promise.all(
    getCandidatePaths(from, to).map(async (path) => {
      try {
        const amounts = await getAmountsOut(client, amountIn, path);
        const amountOut = amounts[amounts.length - 1] ?? 0n;
        return amountOut > 0n ? { path, amountOut } : null;
      } catch {
        return null; // пары нет, router ревертит
      }
    }),
  );

  const best = results
    .filter((r): r is { path: Address[]; amountOut: bigint } => r !== null)
    .sort((a, b) => (b.amountOut > a.amountOut ? 1 : b.amountOut < a.amountOut ? -1 : 0))[0];
  if (!best) return null;

  return { ...best, priceImpact: await getRoutePriceImpact(client, amountIn, best.amountOut, best.path) };
}

async function getRoutePriceImpact(
  client: PublicClient,
  amountIn: bigint,
  amountOut: bigint,
  path: Address[],
): Promise<number | null> {
  try {
    const hops = await Promise.all(
      path.slice(0, -1).map((tokenIn, i) => getHopReserves(client, tokenIn, path[i + 1]!)),
    );
    if (hops.some((h) => h === null)) return null;
    return calcPriceImpact(amountIn, amountOut, hops as HopReserves[]);
  } catch {
    return null;
  }
}
