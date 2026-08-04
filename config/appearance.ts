export type AccentColorId =
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "graphite"
  | "custom";

export type ThemeMode = "light" | "dark" | "system";

export type AppIconStyle = "colored" | "light" | "dark";

export const DEFAULT_APP_ICON_STYLE: AppIconStyle = "colored";
export const APP_ICON_STYLES = [
  { id: "colored", label: "Colored" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
] as const satisfies { id: AppIconStyle; label: string }[];

export function isAppIconStyle(value: string): value is AppIconStyle {
  return APP_ICON_STYLES.some((style) => style.id === value);
}

export interface AccentColorPreset {
  id: AccentColorId;
  label: string;
  hex: string;
  hoverHex: string;
}

export const DEFAULT_ACCENT_COLOR_ID: AccentColorId = "blue";

export const CUSTOM_ACCENT_COLOR_ID = "custom" as const;

export const DEFAULT_CUSTOM_ACCENT_HEX = "#007AFF";

/** Accent swatches — matched to cms-system palette. */
export const ACCENT_COLOR_PRESETS: AccentColorPreset[] = [
  {
    id: "blue",
    label: "Default",
    hex: "#007AFF",
    hoverHex: "#0066D6",
  },
  {
    id: "purple",
    label: "Purple",
    hex: "#A550A6",
    hoverHex: "#8E4490",
  },
  {
    id: "pink",
    label: "Pink",
    hex: "#F74F9D",
    hoverHex: "#E03D8A",
  },
  {
    id: "red",
    label: "Red",
    hex: "#FF5257",
    hoverHex: "#E6454A",
  },
  {
    id: "orange",
    label: "Orange",
    hex: "#F78219",
    hoverHex: "#DE7010",
  },
  {
    id: "yellow",
    label: "Yellow",
    hex: "#FFC600",
    hoverHex: "#E0AE00",
  },
  {
    id: "green",
    label: "Green",
    hex: "#60BA46",
    hoverHex: "#519F3B",
  },
  {
    id: "graphite",
    label: "Graphite",
    hex: "#8C8C8B",
    hoverHex: "#747473",
  },
];

const LEGACY_ACCENT_IDS: Record<string, AccentColorId> = {
  rose: "pink",
  teal: "green",
  neutral: "graphite",
  coral: "red",
};

export function getAccentColorPreset(id: AccentColorId): AccentColorPreset {
  if (id === CUSTOM_ACCENT_COLOR_ID) {
    return ACCENT_COLOR_PRESETS[0] as AccentColorPreset;
  }

  const preset = ACCENT_COLOR_PRESETS.find((item) => item.id === id);
  if (!preset) {
    return ACCENT_COLOR_PRESETS[0] as AccentColorPreset;
  }
  return preset;
}

export function normalizeAccentColorId(value: string): AccentColorId {
  if (value === CUSTOM_ACCENT_COLOR_ID) {
    return CUSTOM_ACCENT_COLOR_ID;
  }

  if (ACCENT_COLOR_PRESETS.some((preset) => preset.id === value)) {
    return value as AccentColorId;
  }

  return LEGACY_ACCENT_IDS[value] ?? DEFAULT_ACCENT_COLOR_ID;
}

export function isAccentColorId(value: string): value is AccentColorId {
  return (
    value === CUSTOM_ACCENT_COLOR_ID ||
    ACCENT_COLOR_PRESETS.some((preset) => preset.id === value)
  );
}
