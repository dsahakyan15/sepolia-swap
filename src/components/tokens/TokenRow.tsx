import { useTokenBalance } from "@/hooks/useTokenBalance";
import { formatAmount, shortenAddress } from "@/lib/format";
import { isNative } from "@/lib/token";
import type { Token } from "@/types/token";
import { TokenIcon } from "./TokenIcon";
import styles from "./TokenRow.module.css";

interface Props {
  token: Token;
  selected?: boolean;
  importable?: boolean;
  onClick: () => void;
  onRemove?: () => void;
}

export function TokenRow({ token, selected, importable, onClick, onRemove }: Props) {
  const balance = useTokenBalance(token);

  return (
    <div className={`${styles.row} ${selected ? styles.selected : ""}`} onClick={onClick}>
      <TokenIcon token={token} size={36} />
      <div className={styles.meta}>
        <b>{token.symbol}</b>
        <small>{isNative(token) ? token.name : `${token.name} · ${shortenAddress(token.address)}`}</small>
      </div>

      {importable ? (
        <span className={styles.import}>Импорт</span>
      ) : (
        balance !== undefined && balance > 0n && <span className={styles.balance}>{formatAmount(balance, token.decimals, 4)}</span>
      )}

      {onRemove && (
        <button
          className={styles.remove}
          title="Удалить из списка"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
