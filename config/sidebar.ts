import type { AppIconStyle } from "@/config/appearance";
import { GLASS_SHELL_SURFACE } from "@/config/glass";
import { RADIUS_OUTER, SEPARATED_CONTROL } from "@/config/shape";

export const SIDEBAR_OPEN_STORAGE_KEY = "scheduler:sidebar-open";

export const SEPARATED_SIDEBAR_CLASS = "app-sidebar";

/** Expanded sidebar width — matches cms-system / shadcn default. */
export const SEPARATED_SIDEBAR_WIDTH = "16rem";

/** Collapsed (icon) rail width — overrides shadcn default 3rem via SidebarProvider. */
export const SEPARATED_SIDEBAR_ICON_WIDTH = "3.75rem";

/** Viewport inset for floating sidebar — synced with globals.css `.app-sidebar` padding. */
export const SEPARATED_SIDEBAR_GUTTER = "";

export const SEPARATED_SIDEBAR_RADIUS = RADIUS_OUTER;

/** Expanded menu row — System Settings density (~22px icons). */
export const SEPARATED_MENU_ITEM = `${SEPARATED_CONTROL} h-8! gap-2 px-2!`;

/** Applied to `[data-slot="sidebar-inner"]` via globals.css — shell border always on. */
export const SEPARATED_SIDEBAR_GLASS = GLASS_SHELL_SURFACE;

/** Uniform inset inside the glass shell (top/right/bottom/left). */
export const SIDEBAR_INNER_PADDING = "0.5rem";

/** Spacing between icon rows when collapsed. */
export const SIDEBAR_COLLAPSED_ITEM_GAP = "0.375rem";

/** Dock item gap in px — keep in sync with SIDEBAR_COLLAPSED_ITEM_GAP. */
export const SIDEBAR_DOCK_ITEM_GAP_PX = 8;

/** Collapsed dock shell — synced with globals.css collapsed inner padding. */
export const SIDEBAR_CONTAINER_GUTTER = "0.75rem";
export const SIDEBAR_EXPANDED_INNER_PADDING = "1rem";
export const SIDEBAR_COLLAPSED_INNER_PADDING_Y = "0.7rem";
export const SIDEBAR_COLLAPSED_INNER_PADDING_X = "1.75rem";
export const SIDEBAR_COLLAPSED_RADIUS = "1.35rem";

/** Wrapper around SidebarCollapsedDock — centers icon column in glass pill. */
export const SIDEBAR_COLLAPSED_DOCK_WRAPPER = "flex w-full justify-center";

/**
 * System Settings–scale squircle (~22px) for expanded sidebar menu items.
 */
export const SIDEBAR_APP_ICON_SHELL =
  "sidebar-app-icon flex size-[1.375rem] shrink-0 items-center justify-center rounded-[0.35rem] bg-linear-to-b shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.55),0_0.5px_1px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.12),0_1px_2px_rgba(0,0,0,0.45)]";

export const SIDEBAR_APP_ICON_GLYPH_SIZE = "size-[0.875rem]!";

/** Larger icons — sidebar header brand + collapsed dock (size-9 = 36). */
export const SIDEBAR_DOCK_APP_ICON_SHELL =
  "sidebar-app-icon flex size-9 shrink-0 items-center justify-center rounded-[0.7rem] bg-linear-to-b shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.14)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_1px_3px_rgba(0,0,0,0.5)]";

export const SIDEBAR_DOCK_APP_ICON_GLYPH_SIZE = "size-4!";

export const SIDEBAR_APP_ICON_GLYPH_SHADOW_COLORED =
  "drop-shadow-[0_0.5px_0.5px_rgba(0,0,0,0.25)]";

const APP_ICON_SHELL_LIGHT = "from-white via-white to-[#F5F5F7]";
const APP_ICON_SHELL_DARK = "from-[#3A3A3C] via-[#2C2C2E] to-[#1C1C1E]";

/** Brand mark — colored style tracks accent/primary. */
const APP_MARK_COLORED_SHELL =
  "from-[color-mix(in_srgb,var(--primary)_88%,white)] via-[var(--primary)] to-[color-mix(in_srgb,var(--primary)_70%,black)]";

/** Sidebar icon shells — matched to cms-system palette. */
const APP_ICON_COLORED_SHELLS = {
  brand: APP_MARK_COLORED_SHELL,
  overview: "from-[#64D2FF] via-[#32ADE6] to-[#007AFF]",
  scheduler: "from-[#8B9AFF] via-[#5B6CFF] to-[#3B4FE0]",
  reports: "from-[#30D158] via-[#28C840] to-[#248A3D]",
  media: "from-[#5AC8FA] via-[#32ADE6] to-[#007AFF]",
  notifications: "from-[#FF9F0A] via-[#FF9500] to-[#C93400]",
  search: "from-[#AEAEB2] via-[#8E8E93] to-[#636366]",
  appearance: "from-[#BF5AF2] via-[#AF52DE] to-[#8944AB]",
  profile: "from-[#C77DFF] via-[#AF52DE] to-[#7D3C98]",
  settings: "from-[#AEAEB2] via-[#8E8E93] to-[#636366]",
  cms: "from-[#64D2FF] via-[#7A8CFF] to-[#AF52DE]",
  collapse: "from-[#E5E5EA] via-[#C7C7CC] to-[#8E8E93]",
} as const;

const APP_ICON_GLYPHS = {
  brand: {
    colored: "text-primary-foreground",
    light: "text-primary",
    dark: "text-white",
  },
  overview: {
    colored: "text-white",
    light: "text-[#007AFF]",
    dark: "text-[#64D2FF]",
  },
  scheduler: {
    colored: "text-white",
    light: "text-[#5B6CFF]",
    dark: "text-[#7C8CFF]",
  },
  reports: {
    colored: "text-white",
    light: "text-[#28C840]",
    dark: "text-[#30D158]",
  },
  media: {
    colored: "text-white",
    light: "text-[#007AFF]",
    dark: "text-[#5AC8FA]",
  },
  notifications: {
    colored: "text-white",
    light: "text-[#FF9500]",
    dark: "text-[#FF9F0A]",
  },
  search: {
    colored: "text-white",
    light: "text-[#636366]",
    dark: "text-[#C7C7CC]",
  },
  appearance: {
    colored: "text-white",
    light: "text-[#AF52DE]",
    dark: "text-[#BF5AF2]",
  },
  profile: {
    colored: "text-white",
    light: "text-[#AF52DE]",
    dark: "text-[#C77DFF]",
  },
  settings: {
    colored: "text-white",
    light: "text-[#636366]",
    dark: "text-[#C7C7CC]",
  },
  cms: {
    colored: "text-white",
    light: "text-[#5B6CFF]",
    dark: "text-[#64D2FF]",
  },
  collapse: {
    colored: "text-white",
    light: "text-[#8E8E93]",
    dark: "text-[#AEAEB2]",
  },
} as const;

export type SidebarAppIconTone = keyof typeof APP_ICON_COLORED_SHELLS;

export function getSidebarAppIconTone(
  tone: SidebarAppIconTone,
  style: AppIconStyle = "colored",
): { shell: string; glyph: string } {
  const shell =
    style === "colored"
      ? APP_ICON_COLORED_SHELLS[tone]
      : style === "light"
        ? APP_ICON_SHELL_LIGHT
        : APP_ICON_SHELL_DARK;

  return {
    shell,
    glyph: APP_ICON_GLYPHS[tone][style],
  };
}

export function getSidebarAppMarkShellClasses(
  size: "sm" | "dock",
  style: AppIconStyle = "colored",
  tone: SidebarAppIconTone = "brand",
): string {
  const base =
    size === "sm" ? SIDEBAR_APP_ICON_SHELL : SIDEBAR_DOCK_APP_ICON_SHELL;

  const shell =
    style === "colored"
      ? tone === "brand"
        ? APP_MARK_COLORED_SHELL
        : APP_ICON_COLORED_SHELLS[tone]
      : style === "light"
        ? APP_ICON_SHELL_LIGHT
        : APP_ICON_SHELL_DARK;

  return `${base} bg-linear-to-b ${shell}`;
}

/** Brand mark glyph — SF icon size inside the fixed dock shell. */
export const SIDEBAR_APP_MARK_LOGO_SIZE = SIDEBAR_DOCK_APP_ICON_GLYPH_SIZE;

/** Mask logo color — contrasts with shell for each icon style. */
export function getSidebarAppMarkLogoClasses(
  style: AppIconStyle = "colored",
): string {
  return APP_ICON_GLYPHS.brand[style];
}

/** Apple Dock magnification — peak scale at cursor. */
export const SIDEBAR_DOCK_MAX_SCALE = 1.75;

/** Distance (px) from cursor where magnification falls to 1. */
export const SIDEBAR_DOCK_INFLUENCE = 70;

/** Base dock icon size in px (size-9 = 36). */
export const SIDEBAR_DOCK_ICON_SIZE = 36;

export const SIDEBAR_DOCK_TRIGGER_CLASS =
  "flex size-9 items-center justify-center rounded-[0.7rem] outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-white/70";

export const SIDEBAR_DOCK_LABEL_CLASS =
  "pointer-events-none absolute top-1/2 left-[calc(100%+0.625rem)] z-50 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-md transition-opacity duration-100";

export const SIDEBAR_DOCK_ACTIVE_DOT_CLASS =
  "pointer-events-none absolute top-1/2 -right-1.75 size-1 -translate-y-1/2 rounded-full bg-white dark:bg-white";
