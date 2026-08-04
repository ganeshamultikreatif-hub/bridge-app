import {
  type AccentColorId,
  type AccentColorPreset,
  type AppIconStyle,
  CUSTOM_ACCENT_COLOR_ID,
  DEFAULT_ACCENT_COLOR_ID,
  DEFAULT_APP_ICON_STYLE,
  DEFAULT_CUSTOM_ACCENT_HEX,
  getAccentColorPreset,
  isAppIconStyle,
  normalizeAccentColorId,
} from "@/config/appearance";
import {
  DEFAULT_GLASS_BLUR_LEVEL,
  GLASS_BLUR_LEVEL_IDS,
} from "@/config/glass-blur";
import {
  clampGlassFillTransparency,
  DEFAULT_GLASS_FILL_TRANSPARENCY,
} from "@/config/glass-fill";
import { buildCustomAccentPreset } from "@/lib/appearance/accent-color-utils";
import { APPEARANCE_STORAGE_KEYS } from "@/lib/appearance/constants";
import type { GlassBlurLevelId } from "@/types/glass-blur";

export function getAccentColorStorageKey(userId: string): string {
  return `${APPEARANCE_STORAGE_KEYS.appearancePrefix}:${userId}:accent-color`;
}

export function getCustomAccentHexStorageKey(userId: string): string {
  return `${APPEARANCE_STORAGE_KEYS.appearancePrefix}:${userId}:custom-accent-hex`;
}

export function getThemeStorageKey(userId: string): string {
  return `${APPEARANCE_STORAGE_KEYS.appearancePrefix}:${userId}:theme-mode`;
}

export function getAppIconStyleStorageKey(userId: string): string {
  return `${APPEARANCE_STORAGE_KEYS.appearancePrefix}:${userId}:app-icon-style`;
}

export function getGlassBorderStorageKey(userId: string): string {
  return `${APPEARANCE_STORAGE_KEYS.appearancePrefix}:${userId}:glass-border`;
}

export function getGlassBlurStorageKey(userId: string): string {
  return `${APPEARANCE_STORAGE_KEYS.appearancePrefix}:${userId}:glass-blur`;
}

export function getGlassFillTransparencyStorageKey(userId: string): string {
  return `${APPEARANCE_STORAGE_KEYS.appearancePrefix}:${userId}:glass-fill-transparency`;
}

export function readStoredAccentColorId(userId: string | null): AccentColorId {
  if (typeof window === "undefined") {
    return DEFAULT_ACCENT_COLOR_ID;
  }

  if (!userId) {
    return DEFAULT_ACCENT_COLOR_ID;
  }

  const userKey = getAccentColorStorageKey(userId);
  let stored = localStorage.getItem(userKey);

  if (!stored) {
    const legacy = localStorage.getItem(
      APPEARANCE_STORAGE_KEYS.legacyAccentColor,
    );

    if (legacy) {
      localStorage.setItem(userKey, legacy);
      stored = legacy;
    }
  }

  if (stored) {
    return normalizeAccentColorId(stored);
  }

  return DEFAULT_ACCENT_COLOR_ID;
}

export function readStoredCustomAccentHex(userId: string | null): string {
  if (typeof window === "undefined" || !userId) {
    return DEFAULT_CUSTOM_ACCENT_HEX;
  }

  const stored = localStorage.getItem(getCustomAccentHexStorageKey(userId));

  return stored ?? DEFAULT_CUSTOM_ACCENT_HEX;
}

export function readStoredAppIconStyle(userId: string | null): AppIconStyle {
  if (typeof window === "undefined" || !userId) {
    return DEFAULT_APP_ICON_STYLE;
  }

  const stored = localStorage.getItem(getAppIconStyleStorageKey(userId));

  if (stored && isAppIconStyle(stored)) {
    return stored;
  }

  return DEFAULT_APP_ICON_STYLE;
}

export function readStoredGlassBorderEnabled(userId: string | null): boolean {
  if (typeof window === "undefined" || !userId) {
    return false;
  }

  return localStorage.getItem(getGlassBorderStorageKey(userId)) === "on";
}

export function readStoredGlassBlurLevel(
  userId: string | null,
): GlassBlurLevelId {
  if (typeof window === "undefined" || !userId) {
    return DEFAULT_GLASS_BLUR_LEVEL;
  }

  const stored = localStorage.getItem(getGlassBlurStorageKey(userId));

  // Migrate legacy on/off toggle.
  if (stored === "on") {
    return DEFAULT_GLASS_BLUR_LEVEL;
  }

  if (stored === "off") {
    return "off";
  }

  if (stored && GLASS_BLUR_LEVEL_IDS.has(stored as GlassBlurLevelId)) {
    return stored as GlassBlurLevelId;
  }

  return DEFAULT_GLASS_BLUR_LEVEL;
}

export function readStoredGlassFillTransparency(userId: string | null): number {
  if (typeof window === "undefined" || !userId) {
    return DEFAULT_GLASS_FILL_TRANSPARENCY;
  }

  const stored = localStorage.getItem(
    getGlassFillTransparencyStorageKey(userId),
  );

  if (stored) {
    const parsed = Number.parseInt(stored, 10);
    if (!Number.isNaN(parsed)) {
      return clampGlassFillTransparency(parsed);
    }
  }

  return DEFAULT_GLASS_FILL_TRANSPARENCY;
}

export function writeStoredAccentColorId(
  userId: string,
  accentColorId: AccentColorId,
): void {
  localStorage.setItem(getAccentColorStorageKey(userId), accentColorId);
}

export function writeStoredCustomAccentHex(userId: string, hex: string): void {
  localStorage.setItem(getCustomAccentHexStorageKey(userId), hex);
}

export function writeStoredAppIconStyle(
  userId: string,
  style: AppIconStyle,
): void {
  localStorage.setItem(getAppIconStyleStorageKey(userId), style);
}

export function writeStoredGlassBorderEnabled(
  userId: string,
  enabled: boolean,
): void {
  localStorage.setItem(
    getGlassBorderStorageKey(userId),
    enabled ? "on" : "off",
  );
}

export function writeStoredGlassBlurLevel(
  userId: string,
  levelId: GlassBlurLevelId,
): void {
  localStorage.setItem(getGlassBlurStorageKey(userId), levelId);
}

export function writeStoredGlassFillTransparency(
  userId: string,
  value: number,
): void {
  localStorage.setItem(
    getGlassFillTransparencyStorageKey(userId),
    String(clampGlassFillTransparency(value)),
  );
}

export function resolveAccentPreset(
  id: AccentColorId,
  customHex?: string | null,
): AccentColorPreset {
  if (id === CUSTOM_ACCENT_COLOR_ID) {
    return buildCustomAccentPreset(customHex ?? DEFAULT_CUSTOM_ACCENT_HEX);
  }

  return getAccentColorPreset(id);
}
