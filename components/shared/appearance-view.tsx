"use client";

import { AccentColorPicker } from "@/components/settings/appearance/accent-color-picker";
import { AppIconStylePicker } from "@/components/settings/appearance/app-icon-style-picker";
import { ThemeModePicker } from "@/components/settings/appearance/theme-mode-picker";
import { GlassBlurPicker } from "@/components/shared/glass-blur-picker";
import { WallpaperPicker } from "@/components/shared/wallpaper-picker";
import {
  SETTINGS_GROUP,
  SETTINGS_INSET_BLOCK,
  SETTINGS_SECTION,
  SETTINGS_SECTION_FOOTER,
  SETTINGS_SECTION_LABEL,
} from "@/config/settings-layout";
import { STACK_GAP } from "@/config/spacing";
import { cn } from "@/lib/utils";

export function AppearanceView() {
  return (
    <div className={cn("flex flex-col", STACK_GAP)}>
      <section className={SETTINGS_SECTION}>
        <h2 className={SETTINGS_SECTION_LABEL}>Appearance</h2>
        <div className={SETTINGS_GROUP}>
          <ThemeModePicker />
        </div>
        <p className={SETTINGS_SECTION_FOOTER}>
          Light, dark, or match your device setting.
        </p>
      </section>

      <section className={SETTINGS_SECTION}>
        <h2 className={SETTINGS_SECTION_LABEL}>App Icons</h2>
        <div className={SETTINGS_GROUP}>
          <AppIconStylePicker />
        </div>
        <p className={SETTINGS_SECTION_FOOTER}>
          Colored tiles, light tiles, or dark tiles for sidebar icons.
        </p>
      </section>

      <section className={SETTINGS_SECTION}>
        <h2 className={SETTINGS_SECTION_LABEL}>Accent Color</h2>
        <div className={SETTINGS_GROUP}>
          <div className={SETTINGS_INSET_BLOCK}>
            <AccentColorPicker />
          </div>
        </div>
        <p className={SETTINGS_SECTION_FOOTER}>
          Accent color for primary buttons and UI highlights.
        </p>
      </section>

      <section className={SETTINGS_SECTION}>
        <h2 className={SETTINGS_SECTION_LABEL}>Glass</h2>
        <div className={SETTINGS_GROUP}>
          <GlassBlurPicker />
        </div>
        <p className={SETTINGS_SECTION_FOOTER}>
          Adjust blur, transparency, and glass border.
        </p>
      </section>

      <section className={SETTINGS_SECTION}>
        <h2 className={SETTINGS_SECTION_LABEL}>Wallpaper</h2>
        <div className={SETTINGS_GROUP}>
          <WallpaperPicker />
        </div>
        <p className={SETTINGS_SECTION_FOOTER}>
          Choose a preset or upload your own image. Solid backgrounds skip the
          accessibility mask.
        </p>
      </section>
    </div>
  );
}
