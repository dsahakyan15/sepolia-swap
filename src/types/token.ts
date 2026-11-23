import type { Address } from "viem";

/** Псевдо-адрес нативного ETH (принятое соглашение, как у 1inch/0x). */
export const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as Address;

export interface Token {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  /** Токен добавлен пользователем вручную */
  isCustom?: boolean;
}
