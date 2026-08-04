"use client";

import {
  ACCENT_COLOR_PRESETS,
  CUSTOM_ACCENT_COLOR_ID,
} from "@/config/appearance";
import { SETTINGS_INSET_BLOCK } from "@/config/settings-layout";
import { useAppearance } from "@/contexts/appearance-context";
import { cn } from "@/lib/utils";
import { CustomAccentColorField } from "./custom-accent-color-field";

export function AccentColorPicker() {
  const { accentColorId, accentPreset, customAccentHex, setAccentColorId } =
    useAppearance();
  const isCustomActive = accentColorId === CUSTOM_ACCENT_COLOR_ID;

  return (
    <div className="space-y-3">
      <div className={SETTINGS_INSET_BLOCK}>
        <fieldset className="grid grid-cols-4 gap-x-1 gap-y-3 border-0 p-0">
          <legend className="sr-only">Accent color</legend>
          {ACCENT_COLOR_PRESETS.map((preset) => {
            const selected = accentColorId === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={selected}
                aria-label={preset.label}
                onClick={() => setAccentColorId(preset.id)}
                className="flex flex-col items-center gap-1.5 rounded-lg px-0.5 py-0.5 transition-opacity active:opacity-80"
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-5.5 shrink-0 rounded-full",
                    selected
                      ? "ring-2 ring-foreground/90 ring-offset-2 ring-offset-background"
                      : "ring-1 ring-black/12 dark:ring-white/20",
                  )}
                  style={{ backgroundColor: preset.hex }}
                />
                <span
                  className={cn(
                    "max-w-full truncate text-center text-[10px] leading-none",
                    selected
                      ? "font-semibold text-foreground"
                      : "font-medium text-muted-foreground",
                  )}
                >
                  {preset.label}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            aria-pressed={isCustomActive}
            aria-label="Custom"
            onClick={() => setAccentColorId(CUSTOM_ACCENT_COLOR_ID)}
            className="flex flex-col items-center gap-1.5 rounded-lg px-0.5 py-0.5 transition-opacity active:opacity-80"
          >
            <span
              aria-hidden
              className={cn(
                "flex size-5.5 shrink-0 items-center justify-center rounded-full",
                isCustomActive
                  ? "ring-2 ring-foreground/90 ring-offset-2 ring-offset-background"
                  : "ring-1 ring-black/12 dark:ring-white/20",
              )}
              style={{ backgroundColor: accentPreset.hex }}
            >
              {!isCustomActive ? (
                <span className="text-[9px] font-semibold text-white mix-blend-difference">
                  #
                </span>
              ) : null}
            </span>
            <span
              className={cn(
                "max-w-full truncate text-center text-[10px] leading-none",
                isCustomActive
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground",
              )}
            >
              Custom
            </span>
          </button>
        </fieldset>
      </div>

      {isCustomActive ? <CustomAccentColorField key={customAccentHex} /> : null}
    </div>
  );
}
