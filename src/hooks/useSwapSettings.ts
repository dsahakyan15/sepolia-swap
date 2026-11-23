import { DEFAULT_SWAP_SETTINGS } from "@/config/settings";
import { STORAGE_KEYS } from "@/lib/storage";
import type { SwapSettings } from "@/types/swap";
import { useLocalStorage } from "./useLocalStorage";

export function useSwapSettings() {
  const [settings, setSettings] = useLocalStorage<SwapSettings>(STORAGE_KEYS.swapSettings, DEFAULT_SWAP_SETTINGS);

  const update = (patch: Partial<SwapSettings>) => setSettings((prev) => ({ ...prev, ...patch }));

  return { settings, update };
}
