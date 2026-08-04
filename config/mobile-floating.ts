/**
 * Mobile floating chrome — align with wang bottom-nav glass width (chrome gutter).
 * Vertical clearance uses original `--mobile-bottom-nav-stack`.
 */

/** Horizontal inset — `.mobile-chrome-inset-x` in globals.css (wang gutter). */
export const MOBILE_FLOATING_INSET_X = "mobile-chrome-inset-x";

/** Right edge aligned with bottom-nav menu orb. */
export const MOBILE_FLOATING_RIGHT =
  "right-[calc(var(--mobile-chrome-gutter)+var(--safe-area-right))]";

/** Left edge aligned with bottom-nav gutter. */
export const MOBILE_FLOATING_LEFT =
  "left-[calc(var(--mobile-chrome-gutter)+var(--safe-area-left))]";

/**
 * Calendar / toolbar floating cluster — sits just above bottom nav.
 * Must portal to `document.body` — parent `backdrop-blur` breaks `position:fixed`.
 * Right column stacks My Mine directly above the control pill.
 */
export const MOBILE_FLOATING_BAR_ROOT = [
  "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-end justify-between gap-3 md:hidden",
  MOBILE_FLOATING_INSET_X,
  "pb-[var(--mobile-floating-bar-pad)]",
].join(" ");

/** Right stack — My Mine directly above toolbar pill. */
export const MOBILE_FLOATING_BAR_TRAILING =
  "pointer-events-none flex flex-col items-end gap-2";

/**
 * Desktop-only My Mine FAB (mobile sits in the portaled floating bar stack).
 */
export const MOBILE_FLOATING_ACTION_ROOT = [
  "pointer-events-none fixed z-50 hidden md:block",
  "md:right-6 md:bottom-6",
].join(" ");

/**
 * Full-width bottom action dock — occupies the bottom-nav chrome slot on
 * secondary pages (detail / new / edit); desktop stays bottom-right.
 */
export const MOBILE_ACTION_DOCK = [
  "pointer-events-none fixed z-30 flex w-full flex-col items-stretch gap-2",
  "inset-x-0 bottom-2 pb-3",
  MOBILE_FLOATING_INSET_X,
  "md:inset-x-auto md:left-auto md:right-6 md:bottom-6 md:w-auto md:items-end md:pb-0",
].join(" ");

/** @deprecated Prefer MOBILE_ACTION_DOCK */
export const MOBILE_DETAIL_ACTION_DOCK = MOBILE_ACTION_DOCK;

/** Inner action pill — full width on mobile (single action). */
export const MOBILE_ACTION_PILL =
  "pointer-events-auto flex w-full min-w-0 items-center gap-1 rounded-full p-1 md:w-auto md:p-1.5";

/** Content-sized pill when exactly 2 actions. */
export const MOBILE_ACTION_PILL_FIT =
  "pointer-events-auto flex w-fit max-w-full items-center gap-1 rounded-full p-1 md:w-auto md:p-1.5";

/** @deprecated Prefer MOBILE_ACTION_PILL */
export const MOBILE_DETAIL_ACTION_PILL = MOBILE_ACTION_PILL;

/**
 * Content-sized (`fit`) only for exactly 2 actions.
 * 1 or 3+ stretch full width (schedule detail with 3 FABs, etc.).
 */
export function shouldMobileActionDockFit(actionCount: number): boolean {
  return actionCount === 2;
}

/** Shared dock control metrics — keep icon + label consistent. */
const MOBILE_ACTION_CONTROL_BASE = [
  "h-9 justify-center gap-1.5 rounded-full px-2.5 py-0",
  "text-[11px] font-medium leading-none",
  "md:h-11 md:gap-2 md:px-3.5 md:text-sm",
  "[&_svg]:size-3.5! [&_svg]:shrink-0 md:[&_svg]:size-4!",
].join(" ");

/** Compact secondary action — content width (fit dock). */
export const MOBILE_ACTION_BUTTON = [
  MOBILE_ACTION_CONTROL_BASE,
  "w-fit shrink-0",
].join(" ");

/**
 * Secondary action — shares the full-width pill (1 or 3+ actions).
 * Desktop stays content-sized.
 */
export const MOBILE_ACTION_BUTTON_STRETCH = [
  MOBILE_ACTION_CONTROL_BASE,
  "min-w-0 flex-1 md:flex-none md:w-fit md:shrink-0",
].join(" ");

/** Primary action — fills the pill when dock is full-width. */
export const MOBILE_ACTION_BUTTON_PRIMARY = [
  MOBILE_ACTION_CONTROL_BASE,
  "min-w-0 flex-1 md:flex-none md:shrink-0",
].join(" ");

/** Primary action — content width (fit dock). */
export const MOBILE_ACTION_BUTTON_PRIMARY_FIT = [
  MOBILE_ACTION_CONTROL_BASE,
  "w-fit shrink-0",
].join(" ");

export const MOBILE_ACTION_LABEL =
  "whitespace-nowrap text-[11px] font-medium leading-none md:text-sm";

export const MOBILE_ACTION_LABEL_PRIMARY =
  "min-w-0 truncate text-[11px] font-medium leading-none md:max-w-none md:overflow-visible md:whitespace-nowrap md:text-sm";

/** Scroll clearance under a bottom action dock. */
export const MOBILE_ACTION_DOCK_SCROLL_PAD =
  "max-md:pb-[calc(var(--mobile-floating-bar-bottom)+4.5rem)]";

/**
 * Secondary FAB stacked above the action dock (e.g. checklist over Save/Batal).
 * Same extended-pill look as mark-all-read.
 */
export const MOBILE_ACTION_DOCK_STACKED_FAB = [
  "pointer-events-auto fixed z-40 md:hidden",
  "left-1/2 -translate-x-1/2",
  "bottom-[calc(var(--mobile-floating-bar-bottom)+3.5rem)]",
  "flex max-w-[min(100vw-2rem,20rem)] items-center justify-center gap-2 rounded-full px-4 py-2",
  "border border-neutral-500/10",
  "bg-primary/50 backdrop-blur-sm",
  "text-sm font-medium text-neutral-900! dark:text-neutral-100!",
  "shadow-[0_6px_22px_rgba(0,0,0,0.2)]",
  "transition-transform active:scale-95",
  "disabled:pointer-events-none disabled:opacity-60",
].join(" ");

/** Extra scroll pad when dock + stacked FAB both show. */
export const MOBILE_ACTION_DOCK_WITH_STACKED_FAB_SCROLL_PAD =
  "max-md:pb-[calc(var(--mobile-floating-bar-bottom)+8rem)]";

/**
 * Floating + FAB — wang `MOBILE_ADD_FAB`.
 * Uses floating-bar bottom so secondary pages (hidden bottom nav) still clear safe area.
 */
export const MOBILE_ADD_FAB = [
  "pointer-events-auto fixed z-40 md:hidden",
  MOBILE_FLOATING_RIGHT,
  "bottom-[var(--mobile-floating-bar-bottom)]",
  "flex size-12 items-center justify-center rounded-full",
  "bg-primary text-primary-foreground",
  "shadow-[0_6px_22px_rgba(0,0,0,0.2)]",
  "transition-transform active:scale-95",
].join(" ");

export const MOBILE_ADD_FAB_ICON = "size-5";

/**
 * Center-bottom extended FAB (e.g. mark all notifications read).
 * Clears bottom nav on mobile; sits above the edge on desktop.
 */
export const MOBILE_CENTER_ACTION_FAB = [
  "pointer-events-auto fixed z-40 left-1/2 -translate-x-1/2",
  "bottom-10",
  "md:bottom-6",
  "flex max-w-[min(100vw-2rem,20rem)] items-center justify-center gap-2 rounded-full px-4 py-2",
  "border border-neutral-500/10",
  "bg-primary/50 backdrop-blur-sm",
  "text-sm font-medium text-neutral-900! dark:text-neutral-100!",
  "shadow-[0_6px_22px_rgba(0,0,0,0.2)]",
  "transition-transform active:scale-95",
  "disabled:pointer-events-none disabled:opacity-60",
].join(" ");

export const MOBILE_CENTER_ACTION_FAB_ICON = "size-4 shrink-0";

/** Extra scroll clearance under a center-bottom FAB. */
export const MOBILE_CENTER_ACTION_FAB_SCROLL_PAD =
  "pb-[calc(var(--mobile-floating-bar-bottom)+4.5rem)] md:pb-24";

/** In-page mobile search + filter row (wang journal filters row). */
export const MOBILE_PAGE_FILTERS_ROW = "flex items-center gap-2 md:hidden";

/** Shared height for in-page search + filter controls. */
export const MOBILE_PAGE_FILTER_CONTROL_HEIGHT = "h-11";

export const MOBILE_PAGE_SEARCH_INPUT = [
  MOBILE_PAGE_FILTER_CONTROL_HEIGHT,
  "min-w-0 flex-1 rounded-2xl shadow-none",
  "focus-visible:border-[var(--glass-shell-border)] focus-visible:ring-0",
  /* Solid system gray — readable over wallpaper / drawer (pair light ↔ dark). */
  "bg-[#f2f2f7]! border-black/8",
  "dark:bg-[#2c2c2e]! dark:border-white/12",
].join(" ");

export const MOBILE_PAGE_FILTER_TRIGGER = [
  MOBILE_PAGE_FILTER_CONTROL_HEIGHT,
  "w-[7.75rem] shrink-0 rounded-2xl shadow-none",
  "min-h-11 py-0 data-[size=default]:h-11! data-[size=sm]:h-11!",
  "focus:ring-0 focus-visible:ring-0",
  "bg-[#f2f2f7]! border-black/8",
  "dark:bg-[#2c2c2e]! dark:border-white/12",
].join(" ");

/** Extra scroll clearance under a mobile add FAB. */
export const MOBILE_ADD_FAB_SCROLL_PAD =
  "max-md:pb-[calc(var(--mobile-floating-bar-bottom)+4rem)]";
