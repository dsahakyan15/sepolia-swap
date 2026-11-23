import { maxUint256, type Address } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { erc20Abi } from "@/abi";
import { isNative } from "@/lib/token";
import type { Token } from "@/types/token";

/** Разрешение (allowance), выданное spender. Для нативного ETH всегда бесконечное. */
export function useTokenAllowance(token: Token, spender: Address): bigint | undefined {
  const { address } = useAccount();
  const native = isNative(token);

  const { data } = useReadContract({
    address: token.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: address ? [address, spender] : undefined,
    query: { enabled: !!address && !native },
  });

  return native ? maxUint256 : data;
}
