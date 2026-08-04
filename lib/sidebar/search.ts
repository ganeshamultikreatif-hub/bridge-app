import {
  getPrimaryNavItemsForUser,
  getSystemNavItemsForUser,
  type NavItem,
} from "@/config/navigation";
import type { SidebarAppIconTone } from "@/config/sidebar";
import {
  type AppIcon,
  MagnifyingGlassIcon,
  PaintpaletteIcon,
} from "@/lib/icons";
import type { AppUser } from "@/types/user";

export type SidebarSearchAction = "navigate" | "appearance";

export interface SidebarSearchItem {
  id: string;
  title: string;
  subtitle: string;
  keywords: string[];
  icon: AppIcon;
  tone: SidebarAppIconTone;
  action: SidebarSearchAction;
  href?: string;
}

export const searchNavItem = {
  title: "Search",
  icon: MagnifyingGlassIcon,
  tone: "search" as const satisfies SidebarAppIconTone,
};

function toSearchItem(link: NavItem): SidebarSearchItem {
  return {
    id: link.href,
    title: link.title,
    subtitle: link.href,
    keywords: [link.title, link.href],
    icon: link.icon,
    tone: link.tone,
    action: "navigate",
    href: link.href,
  };
}

const APPEARANCE_SEARCH_ITEM: SidebarSearchItem = {
  id: "appearance",
  title: "Appearance",
  subtitle: "Tema, wallpaper, dan accent",
  keywords: ["Appearance", "tema", "theme", "wallpaper", "accent"],
  icon: PaintpaletteIcon,
  tone: "appearance",
  action: "appearance",
};

export function buildSidebarSearchItems(user: AppUser): SidebarSearchItem[] {
  return [
    ...getPrimaryNavItemsForUser(user).map(toSearchItem),
    APPEARANCE_SEARCH_ITEM,
    ...getSystemNavItemsForUser(user).map(toSearchItem),
  ];
}

export function filterSidebarSearchItems(
  query: string,
  items: SidebarSearchItem[],
): SidebarSearchItem[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return items;
  }

  return items.filter((item) =>
    item.keywords.some((keyword) => keyword.toLowerCase().includes(normalized)),
  );
}
