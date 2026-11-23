import { ConnectButton } from "./ConnectButton";
import { NetworkBadge } from "./NetworkBadge";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        🦄 Sepolia Swap <span className={styles.tag}>Uniswap V2</span>
      </div>
      <div className={styles.right}>
        <NetworkBadge />
        <ConnectButton />
      </div>
    </header>
  );
}
