"use client";

import type { ThemeMode } from "@/config/appearance";
import {
  SETTINGS_INSET_BLOCK,
  SETTINGS_SEGMENTED_ITEM,
  SETTINGS_SEGMENTED_ITEM_ACTIVE,
  SETTINGS_SEGMENTED_ROW,
} from "@/config/settings-layout";
import { useTheme } from "@/contexts/theme-context";
import { DesktopIcon, type Icon, MoonIcon, SunIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const THEME_MODES = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
] as const satisfies { id: ThemeMode; label: string }[];

const MODE_ICONS = {
  light: SunIcon,
  dark: MoonIcon,
  system: DesktopIcon,
} satisfies Record<ThemeMode, Icon>;

export function ThemeModePicker() {
  const { setTheme, theme } = useTheme();
  const activeTheme = theme ?? "system";

  return (
    <fieldset
      aria-label="Theme mode"
      className={cn(
        SETTINGS_INSET_BLOCK,
        SETTINGS_SEGMENTED_ROW,
        "border-0 p-0",
      )}
    >
      {THEME_MODES.map((mode) => {
        const IconComponent = MODE_ICONS[mode.id];
        const selected = activeTheme === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            aria-pressed={selected}
            onClick={() => setTheme(mode.id)}
            className={cn(
              SETTINGS_SEGMENTED_ITEM,
              selected
                ? SETTINGS_SEGMENTED_ITEM_ACTIVE
                : "text-muted-foreground",
            )}
          >
            <IconComponent className="size-4" />
            {mode.label}
          </button>
        );
      })}
    </fieldset>
  );
}
