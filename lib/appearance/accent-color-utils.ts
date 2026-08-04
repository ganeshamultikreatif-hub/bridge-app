import type { AccentColorPreset } from "@/config/appearance";

const HEX_6_PATTERN = /^#?[0-9a-fA-F]{6}$/;
const HEX_3_PATTERN = /^#?[0-9a-fA-F]{3}$/;

export function normalizeHex(value: string): string | null {
  const trimmed = value.trim();

  if (HEX_6_PATTERN.test(trimmed)) {
    const hex = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    return hex.toUpperCase();
  }

  if (HEX_3_PATTERN.test(trimmed)) {
    const raw = trimmed.replace("#", "");
    const expanded = raw
      .split("")
      .map((char) => `${char}${char}`)
      .join("");

    return `#${expanded.toUpperCase()}`;
  }

  return null;
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

export function deriveHoverHex(hex: string, amount = 0.12): string {
  const normalized = normalizeHex(hex);

  if (!normalized) {
    return hex;
  }

  const value = Number.parseInt(normalized.slice(1), 16);
  const red = clampChannel(((value >> 16) & 0xff) * (1 - amount));
  const green = clampChannel(((value >> 8) & 0xff) * (1 - amount));
  const blue = clampChannel((value & 0xff) * (1 - amount));

  return `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

export function buildCustomAccentPreset(hex: string): AccentColorPreset {
  const normalized = normalizeHex(hex) ?? "#268FE6";

  return {
    id: "custom",
    label: "Custom",
    hex: normalized,
    hoverHex: deriveHoverHex(normalized),
  };
}
