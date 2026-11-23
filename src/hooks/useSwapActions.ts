import { maxUint256 } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { erc20Abi } from "@/abi";
import { contracts } from "@/config/contracts";
import { applySlippage, getDeadline } from "@/lib/swap";
import { isNative } from "@/lib/token";
import type { SwapQuote, SwapSettings } from "@/types/swap";
import type { Token } from "@/types/token";
import { useTransaction } from "./useTransaction";

/** Транзакции страницы обмена: approve, swap, wrap, unwrap. */
export function useSwapActions() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const tx = useTransaction();

  const approve = (token: Token) =>
    tx.run(`Разрешение ${token.symbol}`, () =>
      writeContractAsync({
        address: token.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [contracts.uniswapV2Router.address, maxUint256],
      }),
    );

  const wrap = (amount: bigint) =>
    tx.run("Обёртка ETH → WETH", () =>
      writeContractAsync({ ...contracts.weth, functionName: "deposit", value: amount }),
    );

  const unwrap = (amount: bigint) =>
    tx.run("Развёртка WETH → ETH", () =>
      writeContractAsync({ ...contracts.weth, functionName: "withdraw", args: [amount] }),
    );

  const swap = (tokenIn: Token, tokenOut: Token, quote: SwapQuote, settings: SwapSettings) =>
    tx.run(`Обмен ${tokenIn.symbol} → ${tokenOut.symbol}`, () => {
      if (!address) throw new Error("Кошелёк не подключён");

      const amountOutMin = applySlippage(quote.amountOut, settings.slippageBps);
      const deadline = getDeadline(settings.deadlineMinutes);
      const router = contracts.uniswapV2Router;

      if (isNative(tokenIn)) {
        return writeContractAsync({
          ...router,
          functionName: "swapExactETHForTokens",
          args: [amountOutMin, quote.path, address, deadline],
          value: quote.amountIn,
        });
      }
      if (isNative(tokenOut)) {
        return writeContractAsync({
          ...router,
          functionName: "swapExactTokensForETH",
          args: [quote.amountIn, amountOutMin, quote.path, address, deadline],
        });
      }
      return writeContractAsync({
        ...router,
        functionName: "swapExactTokensForTokens",
        args: [quote.amountIn, amountOutMin, quote.path, address, deadline],
      });
    });

  return { tx, approve, wrap, unwrap, swap };
}
