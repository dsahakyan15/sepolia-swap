import { HIGH_PRICE_IMPACT } from "@/config/settings";
import { isNative } from "@/lib/token";
import type { SwapQuote } from "@/types/swap";
import type { Token } from "@/types/token";

export type SwapAction = "connect" | "switch" | "approve" | "wrap" | "unwrap" | "swap";

export interface SwapButtonState {
  label: string;
  action: SwapAction | null;
  variant: "primary" | "danger";
}

export interface SwapButtonInput {
  isConnected: boolean;
  isWrongNetwork: boolean;
  isBusy: boolean;
  tokenIn: Token;
  amountIn: bigint | null;
  quote: SwapQuote | null | undefined;
  isQuoteLoading: boolean;
  balanceIn: bigint | undefined;
  allowance: bigint | undefined;
}

const disabled = (label: string): SwapButtonState => ({ label, action: null, variant: "primary" });

/** Что показывать на главной кнопке и что она делает. Чистая функция, без React. */
export function getSwapButtonState(input: SwapButtonInput): SwapButtonState {
  const { isConnected, isWrongNetwork, isBusy, tokenIn, amountIn, quote, isQuoteLoading, balanceIn, allowance } =
    input;

  if (!isConnected) return { label: "Подключить MetaMask", action: "connect", variant: "primary" };
  if (isWrongNetwork) return { label: "Переключиться на Sepolia", action: "switch", variant: "primary" };
  if (isBusy) return disabled("Ожидание подтверждения…");
  if (!amountIn) return disabled("Введите сумму");
  if (quote === undefined || (isQuoteLoading && !quote)) return disabled("Получаем котировку…");
  if (quote === null) return disabled("Недостаточно ликвидности");
  if (balanceIn !== undefined && amountIn > balanceIn) return disabled(`Недостаточно ${tokenIn.symbol}`);

  if (quote.kind === "wrap") return { label: "Обернуть ETH → WETH", action: "wrap", variant: "primary" };
  if (quote.kind === "unwrap") return { label: "Развернуть WETH → ETH", action: "unwrap", variant: "primary" };

  if (!isNative(tokenIn) && allowance !== undefined && allowance < amountIn) {
    return { label: `Разрешить ${tokenIn.symbol}`, action: "approve", variant: "primary" };
  }

  if (quote.priceImpact !== null && quote.priceImpact > HIGH_PRICE_IMPACT) {
    return {
      label: `Обменять (влияние на цену ${(quote.priceImpact * 100).toFixed(1)}%)`,
      action: "swap",
      variant: "danger",
    };
  }
  return { label: "Обменять", action: "swap", variant: "primary" };
}
