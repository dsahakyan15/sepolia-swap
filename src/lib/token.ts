import type { Address } from "viem";
import { contracts } from "@/config/contracts";
import { NATIVE_ADDRESS, type Token } from "@/types/token";

export const isSameAddress = (a?: string, b?: string): boolean =>
  !!a && !!b && a.toLowerCase() === b.toLowerCase();

export const isNative = (token: Token): boolean => isSameAddress(token.address, NATIVE_ADDRESS);

export const isWeth = (token: Token): boolean => isSameAddress(token.address, contracts.weth.address);

/** Адрес токена для пути в Uniswap: нативный ETH заменяется на WETH. */
export const toPathAddress = (token: Token): Address =>
  isNative(token) ? contracts.weth.address : token.address;

export const isSameToken = (a: Token, b: Token): boolean => isSameAddress(a.address, b.address);
