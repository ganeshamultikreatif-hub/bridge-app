import type { AccentColorPreset } from "@/config/appearance";

export function applyAccentColor(preset: AccentColorPreset): void {
  const root = document.documentElement;

  root.style.setProperty("--brand", preset.hex);
  root.style.setProperty("--brand-hover", preset.hoverHex);
  root.style.setProperty("--primary", preset.hex);
  root.style.setProperty("--primary-foreground", "#ffffff");
  root.style.setProperty("--ring", preset.hex);
}
