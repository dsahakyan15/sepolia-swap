import type { SwapSettings } from "@/types/swap";

export const DEFAULT_SWAP_SETTINGS: SwapSettings = {
  slippageBps: 50,
  deadlineMinutes: 20,
};

export const SLIPPAGE_PRESETS_BPS = [10, 50, 100] as const;

/** Выше этого влияния на цену кнопка становится красной */
export const HIGH_PRICE_IMPACT = 0.15;
/** Выше этого влияние на цену подсвечивается как предупреждение */
export const MEDIUM_PRICE_IMPACT = 0.03;

/** Сколько ETH оставить на газ при нажатии «Макс» */
export const GAS_RESERVE_ETH = "0.005";

/** Задержка перед запросом котировки после ввода суммы, мс */
export const QUOTE_DEBOUNCE_MS = 400;
