import { useAccount, useBalance, useReadContract } from "wagmi";
import { erc20Abi } from "@/abi";
import { isNative } from "@/lib/token";
import type { Token } from "@/types/token";

/** Баланс текущего аккаунта в нативном ETH или в ERC-20. undefined, пока не загружен. */
export function useTokenBalance(token: Token): bigint | undefined {
  const { address } = useAccount();
  const native = isNative(token);

  const nativeBalance = useBalance({
    address,
    query: { enabled: !!address && native },
  });

  const erc20Balance = useReadContract({
    address: token.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !native },
  });

  return native ? nativeBalance.data?.value : erc20Balance.data;
}
