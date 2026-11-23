import { useState } from "react";
import { parseEther } from "viem";
import { contracts } from "@/config/contracts";
import { GAS_RESERVE_ETH, QUOTE_DEBOUNCE_MS } from "@/config/settings";
import { DEFAULT_TOKENS, ETH } from "@/config/tokens";
import { useDebounce } from "@/hooks/useDebounce";
import { useSwapActions } from "@/hooks/useSwapActions";
import { useSwapQuote } from "@/hooks/useSwapQuote";
import { useSwapSettings } from "@/hooks/useSwapSettings";
import { useTokenAllowance } from "@/hooks/useTokenAllowance";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useWallet } from "@/hooks/useWallet";
import { formatAmount, parseAmount } from "@/lib/format";
import { isNative, isSameToken } from "@/lib/token";
import type { Token } from "@/types/token";
import { TxStatusMessage } from "@/components/common/TxStatusMessage";
import { TokenSelectModal } from "@/components/tokens/TokenSelectModal";
import { FlipButton } from "./FlipButton";
import { SwapDetails } from "./SwapDetails";
import { SwapSettingsPanel } from "./SwapSettingsPanel";
import { TokenAmountInput } from "./TokenAmountInput";
import { getSwapButtonState, type SwapAction } from "./swapButtonState";
import styles from "./SwapCard.module.css";

type Side = "in" | "out";

export function SwapCard() {
  const wallet = useWallet();
  const { settings, update: updateSettings } = useSwapSettings();
  const { tx, approve, wrap, unwrap, swap } = useSwapActions();

  const [tokenIn, setTokenIn] = useState<Token>(ETH);
  const [tokenOut, setTokenOut] = useState<Token>(DEFAULT_TOKENS.find((t) => t.symbol === "USDC")!);
  const [amountInput, setAmountInput] = useState("");
  const [selecting, setSelecting] = useState<Side | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const amountIn = parseAmount(useDebounce(amountInput, QUOTE_DEBOUNCE_MS), tokenIn.decimals);
  const quoteQuery = useSwapQuote(tokenIn, tokenOut, amountIn);
  const quote = quoteQuery.data; // undefined: загружается, null: нет ликвидности

  const balanceIn = useTokenBalance(tokenIn);
  const balanceOut = useTokenBalance(tokenOut);
  const allowance = useTokenAllowance(tokenIn, contracts.uniswapV2Router.address);

  const button = getSwapButtonState({
    isConnected: wallet.isConnected,
    isWrongNetwork: wallet.isWrongNetwork,
    isBusy: tx.isBusy,
    tokenIn,
    amountIn,
    quote: amountIn ? quote : undefined,
    isQuoteLoading: quoteQuery.isFetching,
    balanceIn,
    allowance,
  });

  // ---------- handlers ----------
  const flip = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    if (quote) setAmountInput(formatAmount(quote.amountOut, tokenOut.decimals, tokenOut.decimals));
    tx.reset();
  };

  const selectToken = (token: Token) => {
    const current = selecting === "in" ? tokenIn : tokenOut;
    const other = selecting === "in" ? tokenOut : tokenIn;
    setSelecting(null);
    if (isSameToken(token, current)) return;
    if (isSameToken(token, other)) return flip();
    (selecting === "in" ? setTokenIn : setTokenOut)(token);
    tx.reset();
  };

  const setMax = () => {
    if (balanceIn === undefined) return;
    const reserve = isNative(tokenIn) ? parseEther(GAS_RESERVE_ETH) : 0n;
    const max = balanceIn > reserve ? balanceIn - reserve : 0n;
    setAmountInput(formatAmount(max, tokenIn.decimals, tokenIn.decimals));
  };

  const handleAction = async (action: SwapAction) => {
    switch (action) {
      case "connect":
        return wallet.connect();
      case "switch":
        return wallet.switchToAppChain();
      case "approve":
        return approve(tokenIn);
    }
    if (!quote) return;
    const ok =
      action === "wrap"
        ? await wrap(quote.amountIn)
        : action === "unwrap"
          ? await unwrap(quote.amountIn)
          : await swap(tokenIn, tokenOut, quote, settings);
    if (ok) setAmountInput("");
  };

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <h2>Обмен</h2>
        <button className="icon-btn" onClick={() => setShowSettings((v) => !v)} title="Настройки">
          ⚙️
        </button>
      </div>

      {showSettings && <SwapSettingsPanel settings={settings} onChange={updateSettings} />}

      <TokenAmountInput
        label="Отдаёте"
        token={tokenIn}
        value={amountInput}
        onChange={setAmountInput}
        balance={balanceIn}
        onMax={setMax}
        onSelectToken={() => setSelecting("in")}
      />

      <FlipButton onClick={flip} />

      <TokenAmountInput
        label="Получаете (примерно)"
        token={tokenOut}
        value={amountIn && quote ? formatAmount(quote.amountOut, tokenOut.decimals, 8) : ""}
        placeholder={amountIn && quoteQuery.isFetching ? "…" : "0.0"}
        readOnly
        balance={balanceOut}
        onSelectToken={() => setSelecting("out")}
      />

      {amountIn && quote && <SwapDetails quote={quote} tokenIn={tokenIn} tokenOut={tokenOut} settings={settings} />}

      <button
        className={`btn-primary ${button.variant === "danger" ? "btn-danger" : ""} ${styles.action}`}
        disabled={!button.action}
        onClick={() => button.action && handleAction(button.action)}
      >
        {button.label}
      </button>

      <TxStatusMessage tx={tx} />
      {!wallet.hasMetaMask && (
        <p className={styles.hint}>
          MetaMask не найден.{" "}
          <a href="https://metamask.io/download/" target="_blank" rel="noreferrer">
            Установить
          </a>
        </p>
      )}

      {selecting && (
        <TokenSelectModal
          selected={selecting === "in" ? tokenIn : tokenOut}
          onSelect={selectToken}
          onClose={() => setSelecting(null)}
        />
      )}
    </div>
  );
}
