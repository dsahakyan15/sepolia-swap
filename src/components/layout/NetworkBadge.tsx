import { appChain } from "@/config/chains";
import { useWallet } from "@/hooks/useWallet";
import styles from "./Header.module.css";

export function NetworkBadge() {
  const { isConnected, isWrongNetwork, switchToAppChain } = useWallet();
  if (!isConnected) return null;

  if (isWrongNetwork) {
    return (
      <button className={`${styles.network} ${styles.bad}`} onClick={switchToAppChain}>
        Неверная сеть
      </button>
    );
  }
  return <span className={`${styles.network} ${styles.ok}`}>{appChain.name}</span>;
}
