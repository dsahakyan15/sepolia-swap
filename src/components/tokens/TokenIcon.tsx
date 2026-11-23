import type { Token } from "@/types/token";

/** Простая иконка-заглушка: первая буква символа на цветном фоне, цвет зависит от адреса. */
export function TokenIcon({ token, size = 32 }: { token: Token; size?: number }) {
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
