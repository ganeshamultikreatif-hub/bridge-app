"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type AccentColorId,
  type AccentColorPreset,
  type AppIconStyle,
  CUSTOM_ACCENT_COLOR_ID,
  DEFAULT_ACCENT_COLOR_ID,
  DEFAULT_APP_ICON_STYLE,
  DEFAULT_CUSTOM_ACCENT_HEX,
} from "@/config/appearance";
import { DEFAULT_GLASS_BLUR_LEVEL } from "@/config/glass-blur";
import { DEFAULT_GLASS_FILL_TRANSPARENCY } from "@/config/glass-fill";
import { useTheme } from "@/contexts/theme-context";
import { normalizeHex } from "@/lib/appearance/accent-color-utils";
import { applyAccentColor } from "@/lib/appearance/apply-accent-color";
import { applyGlassAppearance } from "@/lib/appearance/apply-glass-blur";
import {
  readStoredAccentColorId,
  readStoredAppIconStyle,
  readStoredCustomAccentHex,
  readStoredGlassBlurLevel,
  readStoredGlassBorderEnabled,
  readStoredGlassFillTransparency,
  resolveAccentPreset,
  writeStoredAccentColorId,
  writeStoredAppIconStyle,
  writeStoredCustomAccentHex,
  writeStoredGlassBlurLevel,
  writeStoredGlassBorderEnabled,
  writeStoredGlassFillTransparency,
} from "@/lib/appearance/storage";
import type { GlassBlurLevelId } from "@/types/glass-blur";
import type { UserId } from "@/types/user";

interface AppearanceContextValue {
  accentColorId: AccentColorId;
  accentPreset: AccentColorPreset;
  appIconStyle: AppIconStyle;
  customAccentHex: string;
  glassBlurLevel: GlassBlurLevelId;
  glassFillTransparency: number;
  glassBorderEnabled: boolean;
  setAccentColorId: (id: AccentColorId) => void;
  setAppIconStyle: (style: AppIconStyle) => void;
  setCustomAccentHex: (hex: string) => void;
  setGlassBlurLevel: (level: GlassBlurLevelId) => void;
  setGlassFillTransparency: (value: number) => void;
  setGlassBorderEnabled: (enabled: boolean) => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

interface AppearanceProviderProps {
  children: React.ReactNode;
  userId: UserId | null;
}

function applyGlassState(
  level: GlassBlurLevelId,
  transparency: number,
  borderEnabled: boolean,
) {
  applyGlassAppearance(level, transparency, borderEnabled);
}

export function AppearanceProvider({
  children,
  userId,
}: AppearanceProviderProps) {
  const storageUserId = userId ?? "guest";
  const { theme } = useTheme();
  const skipThemeIconSyncRef = useRef(true);
  // Always start from defaults so SSR and the first client render match.
  // Stored values are applied in useLayoutEffect (bootstrap already painted
  // theme/accent/icons via data attributes before hydration).
  const [accentColorId, setAccentColorIdState] = useState<AccentColorId>(
    DEFAULT_ACCENT_COLOR_ID,
  );
  const [customAccentHex, setCustomAccentHexState] = useState(
    DEFAULT_CUSTOM_ACCENT_HEX,
  );
  const [appIconStyle, setAppIconStyleState] = useState<AppIconStyle>(
    DEFAULT_APP_ICON_STYLE,
  );
  const [glassBorderEnabled, setGlassBorderEnabledState] = useState(false);
  const [glassBlurLevel, setGlassBlurLevelState] = useState<GlassBlurLevelId>(
    DEFAULT_GLASS_BLUR_LEVEL,
  );
  const [glassFillTransparency, setGlassFillTransparencyState] = useState(
    DEFAULT_GLASS_FILL_TRANSPARENCY,
  );

  const accentPreset = resolveAccentPreset(accentColorId, customAccentHex);

  useLayoutEffect(() => {
    const storedId = readStoredAccentColorId(storageUserId);
    const storedHex = readStoredCustomAccentHex(storageUserId);
    const storedAppIconStyle = readStoredAppIconStyle(storageUserId);
    const storedGlassBorderEnabled =
      readStoredGlassBorderEnabled(storageUserId);
    const storedGlassBlurLevel = readStoredGlassBlurLevel(storageUserId);
    const storedGlassFillTransparency =
      readStoredGlassFillTransparency(storageUserId);

    setAccentColorIdState(storedId);
    setCustomAccentHexState(storedHex);
    setAppIconStyleState(storedAppIconStyle);
    setGlassBorderEnabledState(storedGlassBorderEnabled);
    setGlassBlurLevelState(storedGlassBlurLevel);
    setGlassFillTransparencyState(storedGlassFillTransparency);
    applyAccentColor(resolveAccentPreset(storedId, storedHex));
    document.documentElement.dataset.appIcon = storedAppIconStyle;
    applyGlassState(
      storedGlassBlurLevel,
      storedGlassFillTransparency,
      storedGlassBorderEnabled,
    );
    // Prefer stored icon style on hydrate; only sync on later theme changes.
    skipThemeIconSyncRef.current = true;
  }, [storageUserId]);

  const setAccentColorId = useCallback(
    (id: AccentColorId) => {
      const preset = resolveAccentPreset(
        id,
        id === CUSTOM_ACCENT_COLOR_ID ? customAccentHex : null,
      );

      setAccentColorIdState(id);
      applyAccentColor(preset);
      writeStoredAccentColorId(storageUserId, id);
    },
    [customAccentHex, storageUserId],
  );

  const setCustomAccentHex = useCallback(
    (hex: string) => {
      const normalized = normalizeHex(hex);

      if (!normalized) {
        return;
      }

      setCustomAccentHexState(normalized);
      setAccentColorIdState(CUSTOM_ACCENT_COLOR_ID);
      applyAccentColor(resolveAccentPreset(CUSTOM_ACCENT_COLOR_ID, normalized));
      writeStoredAccentColorId(storageUserId, CUSTOM_ACCENT_COLOR_ID);
      writeStoredCustomAccentHex(storageUserId, normalized);
    },
    [storageUserId],
  );

  const setAppIconStyle = useCallback(
    (style: AppIconStyle) => {
      setAppIconStyleState(style);
      document.documentElement.dataset.appIcon = style;
      writeStoredAppIconStyle(storageUserId, style);
    },
    [storageUserId],
  );

  // Manual Light/Dark also updates icon style; user can override via App Icon picker.
  // System mode leaves the current icon style alone (same as cms-system).
  useLayoutEffect(() => {
    if (theme === undefined) {
      return;
    }

    if (skipThemeIconSyncRef.current) {
      skipThemeIconSyncRef.current = false;
      return;
    }

    if (theme === "light" || theme === "dark") {
      setAppIconStyle(theme);
    }
  }, [setAppIconStyle, theme]);

  const setGlassBorderEnabled = useCallback(
    (enabled: boolean) => {
      setGlassBorderEnabledState(enabled);
      applyGlassState(glassBlurLevel, glassFillTransparency, enabled);
      writeStoredGlassBorderEnabled(storageUserId, enabled);
    },
    [glassBlurLevel, glassFillTransparency, storageUserId],
  );

  const setGlassBlurLevel = useCallback(
    (level: GlassBlurLevelId) => {
      setGlassBlurLevelState(level);
      applyGlassState(level, glassFillTransparency, glassBorderEnabled);
      writeStoredGlassBlurLevel(storageUserId, level);
    },
    [glassBorderEnabled, glassFillTransparency, storageUserId],
  );

  const setGlassFillTransparency = useCallback(
    (value: number) => {
      setGlassFillTransparencyState(value);
      applyGlassState(glassBlurLevel, value, glassBorderEnabled);
      writeStoredGlassFillTransparency(storageUserId, value);
    },
    [glassBlurLevel, glassBorderEnabled, storageUserId],
  );

  const value = useMemo(
    () => ({
      accentColorId,
      accentPreset,
      appIconStyle,
      customAccentHex,
      glassBlurLevel,
      glassFillTransparency,
      glassBorderEnabled,
      setAccentColorId,
      setAppIconStyle,
      setCustomAccentHex,
      setGlassBlurLevel,
      setGlassFillTransparency,
      setGlassBorderEnabled,
    }),
    [
      accentColorId,
      accentPreset,
      appIconStyle,
      customAccentHex,
      glassBlurLevel,
      glassFillTransparency,
      glassBorderEnabled,
      setAccentColorId,
      setAppIconStyle,
      setCustomAccentHex,
      setGlassBlurLevel,
      setGlassFillTransparency,
      setGlassBorderEnabled,
    ],
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): AppearanceContextValue {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }
  return context;
}

export function useOptionalAppearance(): AppearanceContextValue | null {
  return useContext(AppearanceContext);
}
