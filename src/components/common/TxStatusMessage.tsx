import { explorerTxUrl } from "@/config/chains";
import type { TxState } from "@/hooks/useTransaction";
import styles from "./TxStatusMessage.module.css";

export function TxStatusMessage({ tx }: { tx: TxState }) {
  if (tx.status === "idle") return null;

  const link = tx.hash && (
    <a href={explorerTxUrl(tx.hash)} target="_blank" rel="noreferrer">
      Etherscan ↗
    </a>
  );

  switch (tx.status) {
    case "awaiting-signature":
      return <p className={styles.status}>{tx.label}: подтвердите в MetaMask…</p>;
    case "pending":
      return (
        <p className={styles.status}>
          {tx.label}: ожидаем подтверждения… {link}
        </p>
      );
    case "success":
      return (
        <p className={`${styles.status} ${styles.success}`}>
          ✅ {tx.label}: готово {link}
        </p>
      );
    case "error":
      return (
        <p className={`${styles.status} ${styles.error}`}>
          {tx.error} {link}
        </p>
      );
  }
}
