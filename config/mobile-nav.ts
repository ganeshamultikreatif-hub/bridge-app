import { MOBILE_LIQUID_GLASS_FILL } from "@/config/glass";
import {
  type AppIcon,
  LayoutGridFilled,
  Megaphone,
  MessageIcon,
  Users,
} from "@/lib/icons";

/** Content / floating controls clear this on mobile. */
export const MOBILE_BOTTOM_NAV_OFFSET = "var(--mobile-bottom-nav-stack)";

/** iOS liquid glass — frosted pill + menu orb (visual). */
export const MOBILE_LIQUID_GLASS_SURFACE = `border border-white/28 dark:border-white/12 ${MOBILE_LIQUID_GLASS_FILL}`;

/**
 * Chrome glass — same denser fill as top-bar orbs (`bg-background/50`).
 * Bottom nav pill / menu orb use this so they stay readable over content.
 */
export const MOBILE_CHROME_GLASS_SURFACE = [
  MOBILE_LIQUID_GLASS_SURFACE,
  "!bg-background/50",
].join(" ");

/**
 * Horizontal inset — wang chrome gutter (~20px) + notch.
 * Uses `.mobile-chrome-inset-x` from globals.css (reliable; Tailwind arbitrary
 * calc breaks when LightningCSS strips `--mobile-safe-*` aliases).
 */
export const MOBILE_BOTTOM_NAV_INSET_X = "mobile-chrome-inset-x";

/**
 * Width — wang full-width glass with gutter (not edge-flush).
 * Vertical — original scheduler PWA (`bottom-2` + `pb-3`).
 */
export const MOBILE_BOTTOM_NAV_ROOT = [
  "pointer-events-none fixed inset-x-0 bottom-2 z-40 flex w-full items-end gap-2.5 md:hidden",
  MOBILE_BOTTOM_NAV_INSET_X,
  "pb-3",
].join(" ");

export const MOBILE_BOTTOM_NAV_PILL =
  "pointer-events-auto relative flex min-h-15 min-w-0 flex-1 items-stretch rounded-full p-0.5";

export const MOBILE_BOTTOM_NAV_ITEM =
  "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full py-1.5 text-[10px] font-medium leading-none transition-colors";

export const MOBILE_BOTTOM_NAV_ITEM_WRAPPER = "flex min-w-0 flex-1";

export const MOBILE_BOTTOM_NAV_GLYPH_SLOT =
  "relative z-[1] flex size-6 shrink-0 items-center justify-center overflow-visible";

export const MOBILE_BOTTOM_NAV_LABEL =
  "relative z-[1] max-w-full truncate px-0.5";

export const MOBILE_BOTTOM_NAV_LABEL_ACTIVE = "text-primary";

export const MOBILE_BOTTOM_NAV_ITEM_ACTIVE = "text-foreground dark:text-white";

export const MOBILE_BOTTOM_NAV_ITEM_IDLE =
  "text-foreground/75 hover:text-foreground/95 dark:text-white/72 dark:hover:text-white/90";

/** Perfect circle — height matches pill (`min-h-15`). */
export const MOBILE_BOTTOM_NAV_MENU_BUTTON = [
  "pointer-events-auto relative flex size-15 shrink-0 items-center justify-center rounded-full p-0",
  "text-foreground/80 transition-colors hover:text-foreground",
  "dark:text-white/80 dark:hover:text-white",
].join(" ");

export interface MobileBottomNavItem {
  title: string;
  href: string;
  icon: AppIcon;
}

export const MOBILE_BOTTOM_NAV_ITEMS: MobileBottomNavItem[] = [
  { href: "/dashboard", icon: LayoutGridFilled, title: "Dashboard" },
  { href: "/customers", icon: Users, title: "Customer" },
  { href: "/broadcast", icon: Megaphone, title: "Broadcast" },
  { href: "/inbox", icon: MessageIcon, title: "Inbox" },
];

export function isMobileBottomNavItemActive(
  pathname: string,
  href: string,
): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Exact bottom-nav tab roots only (`/dashboard`, `/scheduler`, …).
 * Nested pages under a tab (e.g. `/scheduler/[id]`) are not menu items.
 */
export function isMobileBottomNavRoute(pathname: string): boolean {
  return MOBILE_BOTTOM_NAV_ITEMS.some((item) => pathname === item.href);
}

/**
 * Hide bottom pill when the path is not a bottom-nav menu item —
 * off-nav pages (settings, notifications) and nested pages (schedule detail).
 * Back via top bar.
 */
export function shouldHideMobileBottomNav(pathname: string): boolean {
  return !isMobileBottomNavRoute(pathname);
}
