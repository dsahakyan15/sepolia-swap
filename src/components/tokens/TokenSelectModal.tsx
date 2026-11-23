import { useState } from "react";
import { isAddress } from "viem";
import { useTokenList } from "@/hooks/useTokenList";
import { useTokenMetadata } from "@/hooks/useTokenMetadata";
import { isSameAddress } from "@/lib/token";
import type { Token } from "@/types/token";
import { Modal } from "@/components/common/Modal";
import { TokenRow } from "./TokenRow";
import styles from "./TokenSelectModal.module.css";

interface Props {
  selected: Token;
  onSelect: (token: Token) => void;
  onClose: () => void;
}

export function TokenSelectModal({ selected, onSelect, onClose }: Props) {
  const { tokens, addToken, removeToken } = useTokenList();
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const filtered = tokens.filter(
    (t) =>
      !query ||
      t.symbol.toLowerCase().includes(query) ||
      t.name.toLowerCase().includes(query) ||
      isSameAddress(t.address, query),
  );

  // Если ввели адрес неизвестного токена, предлагаем его импортировать
  const isUnknownAddress = isAddress(query) && filtered.length === 0;
  const metadata = useTokenMetadata(query, isUnknownAddress);

  const importToken = (token: Token) => {
    addToken(token);
    onSelect(token);
  };

  return (
    <Modal title="Выберите токен" onClose={onClose}>
      <input
        className={styles.search}
        autoFocus
        placeholder="Поиск по названию или адрес 0x…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={styles.list}>
        {filtered.map((token) => (
          <TokenRow
            key={token.address}
            token={token}
            selected={isSameAddress(token.address, selected.address)}
            onClick={() => onSelect(token)}
            onRemove={token.isCustom ? () => removeToken(token.address) : undefined}
          />
        ))}

        {isUnknownAddress && metadata.isLoading && <p className={styles.muted}>Загружаем токен…</p>}
        {isUnknownAddress && metadata.isError && (
          <p className={styles.muted}>По этому адресу в Sepolia не найден ERC-20 токен</p>
        )}
        {isUnknownAddress && metadata.data && (
          <TokenRow token={metadata.data} importable onClick={() => importToken(metadata.data)} />
        )}

        {!isUnknownAddress && filtered.length === 0 && (
          <p className={styles.muted}>Ничего не найдено. Вставьте адрес контракта токена.</p>
        )}
      </div>
    </Modal>
  );
}
