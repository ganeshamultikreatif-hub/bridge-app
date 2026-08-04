import {
  APP_GLASS_SURFACE,
  APP_SURFACE_BORDER,
} from "@/config/shared-surfaces";

/**
 * Compact toolbar density for AppHeader actions — matches breadcrumb pill
 * height (h-8) inside the h-11 chrome.
 */

/** Outer chrome — same dimensions as breadcrumb / utilities clusters. */
export const HEADER_TOOLBAR_CONTAINER = [
  "pointer-events-auto flex h-11 min-w-0 w-fit max-w-full shrink items-center overflow-x-auto overflow-y-visible rounded-full py-1 pl-1.5 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  APP_GLASS_SURFACE,
].join(" ");

export const HEADER_TOOLBAR_CLASS =
  "flex min-w-0 w-max max-w-none items-center gap-1";

export const HEADER_TOOLBAR_HEIGHT = "h-8";

/** Glyph size — matches header Bell / ThemeSwitcher. */
export const HEADER_TOOLBAR_GLYPH = "size-4 shrink-0";

export const HEADER_TOOLBAR_GLYPH_MUTED = `${HEADER_TOOLBAR_GLYPH} text-muted-foreground`;

/** Force pill shape over Button/Input default `rounded-lg` (cva skips twMerge). */
export const HEADER_TOOLBAR_CONTROL_BASE =
  "!rounded-full text-xs font-medium shadow-none";

export const HEADER_TOOLBAR_CONTROL_SURFACE = [
  HEADER_TOOLBAR_HEIGHT,
  HEADER_TOOLBAR_CONTROL_BASE,
  APP_SURFACE_BORDER,
  "bg-[var(--grouped-surface)] backdrop-blur-[calc(var(--glass-backdrop-blur)*0.7)]",
  "hover:bg-black/5 dark:hover:bg-white/10",
].join(" ");

export const HEADER_TOOLBAR_SELECT_TRIGGER = [
  HEADER_TOOLBAR_CONTROL_SURFACE,
  "min-h-8 py-0 data-[size=default]:h-8! data-[size=sm]:h-8!",
  "px-3 text-foreground shadow-none focus:ring-primary/20",
].join(" ");

export const HEADER_TOOLBAR_BUTTON = [
  HEADER_TOOLBAR_CONTROL_SURFACE,
  "min-h-8 h-8! data-[size=default]:h-8!",
  "gap-1.5 px-3",
].join(" ");

export const HEADER_TOOLBAR_ICON_BUTTON = [
  "size-8! min-h-8 min-w-8 h-8! w-8 data-[size=default]:h-8! data-[size=icon]:size-8!",
  "shrink-0 px-0",
].join(" ");

export const HEADER_TOOLBAR_SEARCH_INPUT = [
  HEADER_TOOLBAR_HEIGHT,
  HEADER_TOOLBAR_CONTROL_BASE,
  APP_SURFACE_BORDER,
  "bg-[var(--grouped-surface)] pl-8 pr-8 font-medium text-foreground placeholder:font-normal",
  "backdrop-blur-[calc(var(--glass-backdrop-blur)*0.7)]",
].join(" ");
