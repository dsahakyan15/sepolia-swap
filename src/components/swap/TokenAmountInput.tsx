import { formatAmount, sanitizeAmountInput } from "@/lib/format";
import type { Token } from "@/types/token";
import { TokenIcon } from "@/components/tokens/TokenIcon";
import styles from "./TokenAmountInput.module.css";

interface Props {
  label: string;
  token: Token;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  balance?: bigint;
  onMax?: () => void;
  onSelectToken: () => void;
}

export function TokenAmountInput({
  label,
  token,
  value,
  onChange,
  placeholder = "0.0",
  readOnly,
  balance,
  onMax,
  onSelectToken,
}: Props) {
  return (
    <div className={styles.box}>
      <div className={styles.row}>
        <span className={styles.label}>{label}</span>
        <span className={styles.label}>
          Баланс: {balance === undefined ? "—" : formatAmount(balance, token.decimals)}
          {onMax && balance !== undefined && balance > 0n && (
            <button className={styles.max} onClick={onMax}>
              Макс
            </button>
          )}
        </span>
      </div>
      <div className={styles.row}>
        <input
          className={styles.input}
          inputMode="decimal"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(sanitizeAmountInput(e.target.value))}
        />
        <button className={styles.tokenBtn} onClick={onSelectToken}>
          <TokenIcon token={token} size={24} />
          {token.symbol}
          <span className={styles.caret}>▾</span>
        </button>
      </div>
    </div>
  );
}
