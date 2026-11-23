import { SLIPPAGE_PRESETS_BPS } from "@/config/settings";
import { bpsToPercent, percentToBps } from "@/lib/format";
import type { SwapSettings } from "@/types/swap";
import styles from "./SwapSettingsPanel.module.css";

interface Props {
  settings: SwapSettings;
  onChange: (patch: Partial<SwapSettings>) => void;
}

export function SwapSettingsPanel({ settings, onChange }: Props) {
  const setSlippage = (pct: number) => {
    if (Number.isFinite(pct) && pct > 0 && pct <= 50) onChange({ slippageBps: percentToBps(pct) });
  };

  const setDeadline = (min: number) => {
    if (Number.isInteger(min) && min >= 1 && min <= 180) onChange({ deadlineMinutes: min });
  };

  return (
    <div className={styles.panel}>
      <label className={styles.field}>
        Проскальзывание, %
        <div className={styles.slippageRow}>
          {SLIPPAGE_PRESETS_BPS.map((bps) => (
            <button
              key={bps}
              className={`${styles.chip} ${settings.slippageBps === bps ? styles.active : ""}`}
              onClick={() => onChange({ slippageBps: bps })}
            >
              {bpsToPercent(bps)}
            </button>
          ))}
          <input
            type="number"
            min={0.01}
            max={50}
            step={0.1}
            defaultValue={bpsToPercent(settings.slippageBps)}
            key={settings.slippageBps}
            onBlur={(e) => setSlippage(parseFloat(e.target.value))}
          />
        </div>
      </label>

      <label className={styles.field}>
        Дедлайн транзакции, мин
        <input
          type="number"
          min={1}
          max={180}
          defaultValue={settings.deadlineMinutes}
          onBlur={(e) => setDeadline(parseInt(e.target.value, 10))}
        />
      </label>
    </div>
  );
}
