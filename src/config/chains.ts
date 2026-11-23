import { sepolia } from "wagmi/chains";

/** Сеть, в которой работает приложение. */
export const appChain = sepolia;

export const RPC_URL: string =
  import.meta.env.VITE_SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

export const EXPLORER_URL = appChain.blockExplorers.default.url;

export const explorerTxUrl = (hash: string) => `${EXPLORER_URL}/tx/${hash}`;
export const explorerAddressUrl = (address: string) => `${EXPLORER_URL}/address/${address}`;
