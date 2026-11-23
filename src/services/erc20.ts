import type { Address, PublicClient } from "viem";
import { erc20Abi } from "@/abi";
import type { Token } from "@/types/token";

/** Загружает symbol / name / decimals токена по адресу. Бросает исключение, если это не ERC-20. */
export async function fetchTokenMetadata(client: PublicClient, address: Address): Promise<Token> {
  const base = { address, abi: erc20Abi } as const;
  const [symbol, name, decimals] = await Promise.all([
    client.readContract({ ...base, functionName: "symbol" }),
    client.readContract({ ...base, functionName: "name" }),
    client.readContract({ ...base, functionName: "decimals" }),
  ]);
  return { address, symbol, name, decimals, isCustom: true };
}
