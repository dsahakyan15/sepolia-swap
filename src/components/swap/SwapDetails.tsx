import type { ReactNode } from "react";
import { formatUnits } from "viem";
import { HIGH_PRICE_IMPACT, MEDIUM_PRICE_IMPACT } from "@/config/settings";
import { formatAmount, formatPercent } from "@/lib/format";
import { applySlippage } from "@/lib/swap";
import { isNative, isSameAddress } from "@/lib/token";
import { useTokenList } from "@/hooks/useTokenList";
import type { SwapQuote, SwapSettings } from "@/types/swap";
import type { Token } from "@/types/token";
import styles from "./SwapDetails.module.css";

interface Props {
  quote: SwapQuote;
  tokenIn: Token;
  tokenOut: Token;
  settings: SwapSettings;
}

export function SwapDetails({ quote, tokenIn, tokenOut, settings }: Props) {
  const { tokens } = useTokenList();

  const rate =
    Number(formatUnits(quote.amountOut, tokenOut.decimals)) / Number(formatUnits(quote.amountIn, tokenIn.decimals));

  const routeLabel = quote.path
    .map((address, i) => {
      if (i === 0 && isNative(tokenIn)) return "ETH";
      if (i === quote.path.length - 1 && isNative(tokenOut)) return "ETH";
      return tokens.find((t) => isSameAddress(t.address, address))?.symbol ?? address.slice(0, 6);
    })
    .join(" → ");

  const impactClass =
    quote.priceImpact === null
      ? ""
      : quote.priceImpact > HIGH_PRICE_IMPACT
        ? styles.danger
        : quote.priceImpact > MEDIUM_PRICE_IMPACT
          ? styles.warn
          : styles.good;

  return (
    <div className={styles.details}>
      <Row label="Курс">
        1 {tokenIn.symbol} ≈ {rate.toPrecision(6)} {tokenOut.symbol}
      </Row>

      {quote.kind === "swap" && (
        <>
          <Row label="Влияние на цену">
            <span className={impactClass}>{quote.priceImpact === null ? "—" : formatPercent(quote.priceImpact)}</span>
          </Row>
          <Row label="Минимум к получению">
            {formatAmount(applySlippage(quote.amountOut, settings.slippageBps), tokenOut.decimals)} {tokenOut.symbol}
          </Row>
          <Row label="Маршрут">{routeLabel}</Row>
          <Row label="Комиссия пула">0.3%</Row>
        </>
      )}

      {quote.kind !== "swap" && <Row label="Тип">Напрямую через контракт WETH, 1:1</Row>}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span>{children}</span>
    </div>
  );
}
