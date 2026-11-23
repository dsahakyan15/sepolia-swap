import { useWallet } from "@/hooks/useWallet";
import { shortenAddress } from "@/lib/format";

export function ConnectButton() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();

  if (isConnected && address) {
    return (
      <button className="btn-secondary" onClick={disconnect} title="Отключить">
        {shortenAddress(address)}
      </button>
    );
  }

  return (
    <button className="btn-secondary" onClick={connect} disabled={isConnecting}>
      {isConnecting ? "Подключение…" : "Подключить MetaMask"}
    </button>
  );
}
