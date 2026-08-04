"use client";

import { AppIconStylePreview } from "@/components/shared/app-icon-style-preview";
import { APP_ICON_STYLES } from "@/config/appearance";
import {
  SETTINGS_INSET_BLOCK,
  SETTINGS_SEGMENTED_ITEM,
  SETTINGS_SEGMENTED_ITEM_ACTIVE,
  SETTINGS_SEGMENTED_ROW,
} from "@/config/settings-layout";
import { useAppearance } from "@/contexts/appearance-context";
import { cn } from "@/lib/utils";

export function AppIconStylePicker() {
  const { appIconStyle, setAppIconStyle } = useAppearance();

  return (
    <fieldset
      aria-label="App icon style"
      className={cn(
        SETTINGS_INSET_BLOCK,
        SETTINGS_SEGMENTED_ROW,
        "border-0 p-0",
      )}
    >
      {APP_ICON_STYLES.map((style) => {
        const selected = appIconStyle === style.id;

        return (
          <button
            key={style.id}
            type="button"
            aria-pressed={selected}
            onClick={() => setAppIconStyle(style.id)}
            className={cn(
              SETTINGS_SEGMENTED_ITEM,
              "gap-1.5 py-2",
              selected
                ? SETTINGS_SEGMENTED_ITEM_ACTIVE
                : "text-muted-foreground",
            )}
          >
            <AppIconStylePreview style={style.id} />
            {style.label}
          </button>
        );
      })}
    </fieldset>
  );
}
