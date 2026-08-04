/** Dashboard layout + widget chrome — keep in sync with cms-system. */

import { type AppIcon, Megaphone, Plus, Settings, Upload } from "@/lib/icons";

/** Max height for scrollable recent lists — keeps widgets compact. */
export const DASHBOARD_RECENT_LIST_MAX_HEIGHT = "max-h-40";

/** Fixed widget height shell for recent lists. */
export const DASHBOARD_RECENT_WIDGET_HEIGHT = "h-[15.5rem]";

/** Compact height for small bento tiles (stats / focus). */
export const DASHBOARD_BENTO_TILE_HEIGHT = "min-h-[7.5rem] h-[7.5rem]";

/** Compact height for medium bento tiles. */
export const DASHBOARD_BENTO_MEDIUM_HEIGHT = "min-h-[10.5rem] h-[10.5rem]";

/** macOS-style widget corner radius (~22px). */
export const DASHBOARD_WIDGET_RADIUS = "rounded-[1.25rem]";

/** Spacing between widgets — matched by edge inset for even rhythm. */
export const DASHBOARD_WIDGET_GAP = "gap-2.5";

/**
 * Even inset — widget shadows are biased right/down so the left edge
 * does not bleed into the sidebar gap.
 */
export const DASHBOARD_WIDGET_INSET = "p-0";

export interface DashboardQuickAction {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: AppIcon;
  /** Tinted tile surface. */
  surface: string;
}

function tintedSurface(from: string, to: string, glowRgb: string) {
  return [
    "border-0 bg-linear-to-br text-white",
    from,
    to,
    `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),2px_4px_12px_-2px_rgb(${glowRgb}/0.22)]`,
  ].join(" ");
}

/** Create-only shortcuts — HubSpot-style primary actions. */
export const DASHBOARD_QUICK_ACTIONS: DashboardQuickAction[] = [
  {
    id: "broadcast",
    label: "Create Broadcast",
    description: "Launch a campaign",
    href: "/broadcast/new",
    icon: Megaphone,
    surface: tintedSurface("from-[#5AC8FA]", "to-[#007AFF]", "0_122_255"),
  },
  {
    id: "customers",
    label: "Add Customer",
    description: "New contact record",
    href: "/customers/new",
    icon: Plus,
    surface: tintedSurface("from-[#64E286]", "to-[#30D158]", "48_209_88"),
  },
  {
    id: "import",
    label: "Import Excel",
    description: "Import contacts",
    href: "/customers?import=1",
    icon: Upload,
    surface: tintedSurface("from-[#FFB340]", "to-[#FF9500]", "255_149_0"),
  },
  {
    id: "invite",
    label: "Invite User",
    description: "Team access · Settings",
    href: "/settings",
    icon: Settings,
    surface: tintedSurface("from-[#8B9AFF]", "to-[#5B6CFF]", "91_108_255"),
  },
];

export function getTimeOfDayGreeting(date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function formatDashboardDate(date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDashboardTime(date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDashboardSeconds(date = new Date()): string {
  return String(date.getSeconds()).padStart(2, "0");
}
