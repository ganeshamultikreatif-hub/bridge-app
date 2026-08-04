import { MODAL_PANEL_SURFACE } from "@/config/glass";
import { RADIUS_OUTER } from "@/config/shape";

export const SETTINGS_SECTION_LABEL =
  "px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground";

export const SETTINGS_SECTION_FOOTER =
  "px-1 text-[11px] leading-relaxed text-muted-foreground";

/** Section block — label, group, footer. */
export const SETTINGS_SECTION = "flex flex-col gap-1.5";

/** Label → control vertical rhythm inside a group. */
export const SETTINGS_FIELD = "flex flex-col gap-2";

export const SETTINGS_FIELD_LABEL =
  "text-sm font-medium leading-none text-foreground";

export const SETTINGS_SUBFIELD_LABEL =
  "text-xs font-medium leading-none text-muted-foreground";

export const SETTINGS_FIELD_HINT =
  "text-[11px] leading-relaxed text-muted-foreground";

/** Stacked controls inside one inset block. */
export const SETTINGS_CONTROL_STACK = "flex flex-col gap-4";

export const SETTINGS_GROUP =
  "overflow-hidden rounded-[var(--radius-inner)] bg-[var(--grouped-surface)] ring-1 ring-[color:var(--separator)] glass-backdrop shadow-sm";

export const SETTINGS_ROW =
  "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors active:bg-foreground/5";

export const SETTINGS_INSET_BLOCK = "p-3";

/**
 * Appearance option row — plain flex, no frosted track (page tabs own that).
 */
export const SETTINGS_SEGMENTED_ROW = "flex w-full gap-1";

/** Icon + label option (theme, glass blur, app icon). */
export const SETTINGS_SEGMENTED_ITEM =
  "flex min-h-9 flex-1 flex-col items-center justify-center gap-1 rounded-full px-1 py-1.5 text-[11px] font-medium transition-all";

/** Selected appearance option. */
export const SETTINGS_SEGMENTED_ITEM_ACTIVE =
  "border border-[var(--glass-shell-border)] bg-card/92 text-foreground shadow-sm backdrop-blur-[var(--glass-backdrop-blur)]";

export const SETTINGS_ROW_DIVIDER =
  "border-b pb-4 border-[color:var(--separator)]";

/** Floating appearance panel — same frosted surface as Dialog. */
export const APPEARANCE_DRAWER_SURFACE = [
  "appearance-drawer",
  RADIUS_OUTER,
  MODAL_PANEL_SURFACE,
  "inset-y-3! left-3! right-auto! h-auto! w-[min(28rem,calc(100vw-1.5rem))]! max-w-none! sm:max-w-none!",
  "flex flex-col gap-0 overflow-hidden border-0! p-0",
].join(" ");

/** Wallpaper grid padding inside settings group. */
export const WALLPAPER_GRID_WRAPPER = [
  SETTINGS_INSET_BLOCK,
  "border-t border-[color:var(--separator)]",
].join(" ");

export const WALLPAPER_GRID_GAP = "gap-2";
