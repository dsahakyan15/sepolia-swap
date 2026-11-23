import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Hash } from "viem";
import { usePublicClient } from "wagmi";
import { getErrorMessage } from "@/lib/errors";

export type TxStatus = "idle" | "awaiting-signature" | "pending" | "success" | "error";

export interface TxState {
  status: TxStatus;
  hash?: Hash;
  error?: string;
  /** Подпись для UI: «Обмен», «Разрешение USDC», … */
  label?: string;
}

/**
 * Общий жизненный цикл транзакции: подпись -> отправка -> ожидание чека.
 * После успеха инвалидирует кэш запросов, чтобы балансы и allowance обновились.
 */
export function useTransaction() {
  const client = usePublicClient();
  const queryClient = useQueryClient();
  const [state, setState] = useState<TxState>({ status: "idle" });

  const run = useCallback(
    async (label: string, send: () => Promise<Hash>): Promise<boolean> => {
      setState({ status: "awaiting-signature", label });
      try {
        const hash = await send();
        setState({ status: "pending", hash, label });

        const receipt = await client!.waitForTransactionReceipt({ hash });
        if (receipt.status !== "success") throw new Error("Транзакция отменена (reverted)");

        setState({ status: "success", hash, label });
        await queryClient.invalidateQueries();
        return true;
      } catch (error) {
        setState((prev) => ({ status: "error", hash: prev.hash, label, error: getErrorMessage(error) }));
        return false;
      }
    },
    [client, queryClient],
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return {
    ...state,
    isBusy: state.status === "awaiting-signature" || state.status === "pending",
    run,
    reset,
  };
}
