import { getBreadcrumbs } from "@/config/breadcrumbs";
import {
  MOBILE_CHROME_GLASS_SURFACE,
  shouldHideMobileBottomNav,
} from "@/config/mobile-nav";
import { PAGE_META } from "@/config/page-meta";

/**
 * Strip glass shell on mobile — no clipping card (wang `max-md:contents`).
 * Desktop keeps the frosted GlassPanel frame.
 *
 * Literals use `max-md:` so Tailwind scans them (do not build via `mobileOnly`).
 */
export const MOBILE_NATIVE_SHELL = [
  "max-md:contents",
  "max-md:rounded-none",
  "max-md:border-0",
  "max-md:bg-transparent",
  "max-md:shadow-none",
  "max-md:overflow-visible",
  "max-md:[backdrop-filter:none]",
  "max-md:[-webkit-backdrop-filter:none]",
].join(" ");

/** Content clears fixed top bar on mobile. */
export const MOBILE_TOP_BAR_OFFSET = "var(--mobile-top-bar-offset)";

/**
 * Mobile scroll top — clears fixed top bar + large-title breathing room.
 */
export const MOBILE_CHROME_SCROLL_INSET_TOP = [
  "max-md:pt-[calc(var(--mobile-top-bar-offset)+2rem)]",
  "max-md:scroll-pt-[calc(var(--mobile-safe-top)+1.75rem)]",
].join(" ");

/**
 * Scroll-padding at end — pairs with `MOBILE_SCROLL_BOTTOM_SPACER` so content
 * can scroll under the frosted bottom nav (see-through).
 */
export const MOBILE_CHROME_SCROLL_INSET_BOTTOM =
  "max-md:scroll-pb-[var(--mobile-scroll-inset-bottom)]";

/** Spacer at scroll content end — immune to max-md:p-0 on shells. */
export const MOBILE_SCROLL_BOTTOM_SPACER = "mobile-scroll-bottom-spacer";

/** iOS large title — left-aligned, scrolls away on mobile (wang). */
export const MOBILE_PAGE_TITLE_LARGE = [
  "md:hidden",
  "text-left",
  "text-[2.125rem] font-bold leading-tight tracking-tight text-foreground",
  "pb-2",
].join(" ");

/** @deprecated Use MOBILE_PAGE_TITLE_LARGE */
export const MOBILE_PAGE_TITLE = MOBILE_PAGE_TITLE_LARGE;

/** Compact centered title in fixed nav bar — iOS collapsed state. */
export const MOBILE_COMPACT_TITLE = [
  "pointer-events-none absolute inset-x-12 text-center",
  "text-[1.0625rem] font-semibold leading-tight tracking-tight text-foreground",
  "origin-center will-change-[opacity,transform,filter]",
  "transition-[opacity,transform,filter] duration-300 ease-out",
].join(" ");

export const MOBILE_COMPACT_TITLE_VISIBLE = "opacity-100 scale-100 blur-none";

export const MOBILE_COMPACT_TITLE_HIDDEN = "opacity-0 scale-[0.94] blur-[3px]";

/** Soft gradient + fading blur scrim — visible after scroll. */
export const MOBILE_SCROLL_TOP_BLUR = [
  "pointer-events-none fixed inset-x-0 top-0 z-[29]",
  "opacity-0 transition-opacity duration-200",
  "h-28",
  "bg-linear-to-b from-background/30 via-background/10 to-transparent",
  "backdrop-blur-xs",
  "[-webkit-mask-image:linear-gradient(to_bottom,black_10%,transparent)]",
  "mask-[linear-gradient(to_bottom,black_35%,transparent)]",
  "md:hidden",
].join(" ");

/** Fixed nav chrome — blur layer + compact title + actions. */
export const MOBILE_TOP_BAR_ROOT = [
  "pointer-events-none fixed inset-x-0 top-0 z-30",
  "md:hidden",
].join(" ");

export const MOBILE_TOP_BAR_ROW = [
  "relative flex w-full items-center justify-end",
  /* Match wang bottom-nav glass inset + top safe pad (globals CSS). */
  "mobile-chrome-inset-x",
  "mobile-chrome-safe-top",
].join(" ");

/** Shared glass for top bar orbs — same denser fill as bottom nav. */
export const MOBILE_TOP_BAR_GLASS_SURFACE = MOBILE_CHROME_GLASS_SURFACE;

export const MOBILE_TOP_BAR_ORB_SURFACE = MOBILE_TOP_BAR_GLASS_SURFACE;

/** Floating glass orb — top bar actions (filter, back, menu). */
export const MOBILE_TOP_BAR_ORB_BUTTON = [
  "pointer-events-auto flex size-11 shrink-0 items-center justify-center rounded-full",
  MOBILE_TOP_BAR_ORB_SURFACE,
  "text-foreground/90 transition-transform active:scale-95",
  "[&_svg]:size-[1.35rem]",
].join(" ");

export const MOBILE_TOP_BAR_ACTIONS =
  "pointer-events-auto flex shrink-0 items-center gap-2";

/** Halo when large title sits over wallpaper (wang overview). */
export const MOBILE_WALLPAPER_PAGE_TITLE = [
  "md:hidden",
  "[text-shadow:0_1px_2px_color-mix(in_srgb,var(--background)_85%,transparent),0_0_20px_color-mix(in_srgb,var(--background)_55%,transparent)]",
].join(" ");

/** Stack desktop header toolbar controls vertically inside the mobile drawer. */
export const MOBILE_HEADER_TOOLS_DRAWER_BODY = [
  "flex flex-col gap-3",
  "[&_[data-slot=header-toolbar]]:flex-col",
  "[&_[data-slot=header-toolbar]]:w-full",
  "[&_[data-slot=header-toolbar]]:items-stretch",
  "[&_input]:w-full",
  "[&_button]:w-full",
  "[&_[data-slot=select-trigger]]:w-full",
].join(" ");

export function getMobilePageTitle(pathname: string): string {
  const exact = PAGE_META[pathname]?.title;
  if (exact) {
    return exact;
  }

  const crumbs = getBreadcrumbs(pathname);
  return crumbs.at(-1)?.label ?? "Dashboard";
}

/** Exact bottom-nav menu items — large title without back orb. */
export function isMobilePrimaryRoute(pathname: string): boolean {
  return !shouldHideMobileBottomNav(pathname);
}

/**
 * Back orb for secondary chrome:
 * - off-nav pages (notifications, settings, profile)
 * - nested pages not in the bottom menu (e.g. schedule detail / edit / new)
 */
export function shouldShowMobileTopBarBack(pathname: string): boolean {
  return (
    shouldHideMobileBottomNav(pathname) || getBreadcrumbs(pathname).length > 1
  );
}

export function getMobileTopBarBackHref(pathname: string): string {
  const parent = getBreadcrumbs(pathname)
    .slice(0, -1)
    .reverse()
    .find((item) => item.href);

  return parent?.href ?? "/dashboard";
}
