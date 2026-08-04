/**
 * iOS segmented control — pill track + nested items.
 * Keep in sync with Appearance / System Settings pickers.
 *
 * Track + tiles: `rounded-full` with glass blur.
 * Active tile: `bg-card/92` panel chrome (pill).
 *
 * Active state classes must be full static strings so Tailwind can detect them.
 */

/** Outer track — pill + frosted wash. */
export const IOS_SEGMENTED_TRACK =
  "flex w-full rounded-full bg-[rgb(120_120_128/0.12)] p-1 backdrop-blur-[var(--glass-backdrop-blur)] supports-backdrop-filter:bg-[rgb(120_120_128/0.1)] dark:bg-white/8 dark:supports-backdrop-filter:bg-white/6";

/** Text-only segment (page tabs, filters). */
export const IOS_SEGMENTED_ITEM =
  "flex min-h-8 flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-all";

/** Icon + label segment (theme mode, glass blur). */
export const IOS_SEGMENTED_ITEM_STACKED =
  "flex min-h-9 flex-1 flex-col items-center justify-center gap-1 rounded-full px-1 py-1.5 text-[11px] font-medium transition-all";

/** Active tile — panel chrome, pill radius. Keep `bg-card/92`. */
export const IOS_SEGMENTED_ITEM_ACTIVE =
  "rounded-full border border-[var(--glass-shell-border)] bg-card/92 text-foreground shadow-[0_8px_28px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-[var(--glass-backdrop-blur)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)]";

/**
 * Active styles for Radix / Base UI triggers.
 * Static literals only — do not build these via string concat at runtime.
 */
export const IOS_SEGMENTED_ITEM_ACTIVE_STATE = [
  "data-active:rounded-full data-[state=active]:rounded-full",
  "data-active:border data-[state=active]:border",
  "data-active:border-[var(--glass-shell-border)] data-[state=active]:border-[var(--glass-shell-border)]",
  "data-active:bg-card/92 data-[state=active]:bg-card/92",
  "data-active:text-foreground data-[state=active]:text-foreground",
  "data-active:shadow-[0_8px_28px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.35)] data-[state=active]:shadow-[0_8px_28px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.35)]",
  "data-active:backdrop-blur-[var(--glass-backdrop-blur)] data-[state=active]:backdrop-blur-[var(--glass-backdrop-blur)]",
  "dark:data-active:shadow-[0_10px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)] dark:data-[state=active]:shadow-[0_10px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)]",
].join(" ");

export const IOS_SEGMENTED_ITEM_INACTIVE = "text-muted-foreground";
