import { useQuery } from "@tanstack/react-query";
import { isAddress, getAddress } from "viem";
import { usePublicClient } from "wagmi";
import { fetchTokenMetadata } from "@/services/erc20";

/** Загружает метаданные ERC-20 по введённому адресу (для импорта токена). */
export function useTokenMetadata(address: string, enabled = true) {
  const client = usePublicClient();
  const valid = isAddress(address);

  return useQuery({
    queryKey: ["tokenMetadata", address.toLowerCase()],
    queryFn: () => fetchTokenMetadata(client!, getAddress(address)),
    enabled: enabled && valid && !!client,
    retry: false,
    staleTime: Infinity,
  });
}
