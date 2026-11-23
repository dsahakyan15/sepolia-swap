import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { appChain } from "@/config/chains";

/** Состояние кошелька и действия с ним в одном месте. */
export function useWallet() {
  const { address, chainId, isConnected, isConnecting } = useAccount();
  const { connect, connectors, error: connectError, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const hasMetaMask = typeof window !== "undefined" && !!window.ethereum;

  return {
    address,
    isConnected,
    isConnecting: isConnecting || isConnectPending,
    isWrongNetwork: isConnected && chainId !== appChain.id,
    isSwitching,
    hasMetaMask,
    connectError,
    connect: () => {
      const connector = connectors[0];
      if (connector) connect({ connector, chainId: appChain.id });
    },
    disconnect: () => disconnect(),
    switchToAppChain: () => switchChain({ chainId: appChain.id }),
  };
}

declare global {
  interface Window {
    ethereum?: unknown;
  }
}
