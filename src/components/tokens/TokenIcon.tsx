import { useState } from "react";
import type { Token } from "@/types/token";

/**
 * Иконка токена. Если у токена есть logoURI, показываем картинку,
 * иначе (или если картинка не загрузилась) — заглушку: первая буква символа на цветном фоне.
 */
export function TokenIcon({ token, size = 32 }: { token: Token; size?: number }) {
  const [failed, setFailed] = useState(false);

  if (token.logoURI && !failed) {
    return (
      <img
        src={token.logoURI}
        alt={token.symbol}
        width={size}
        height={size}
        style={{ borderRadius: "50%", flexShrink: 0 }}
        onError={() => setFailed(true)}
      />
    );
  }

  const hue = parseInt(token.address.slice(2, 8), 16) % 360;
  return (
    <span
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontWeight: 700,
        color: "#fff",
        background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 70% 40%))`,
      }}
    >
      {token.symbol.slice(0, 1)}
    </span>
  );
}
