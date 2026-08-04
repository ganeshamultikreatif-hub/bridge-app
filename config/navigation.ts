import { CMS_SYSTEM_HREF, CMS_SYSTEM_LOGO_SRC } from "@/config/cms";
import {
  SCHEDULER_APP_HREF,
  SCHEDULER_APP_LOGO_SRC,
} from "@/config/scheduler-suite";
import type { SidebarAppIconTone } from "@/config/sidebar";
import {
  type AppIcon,
  BarChart3,
  Briefcase,
  Building2Icon,
  CalendarDays,
  GearSixIcon,
  GlobeIcon,
  ListBulletClipboardIcon,
  Megaphone,
  MessageIcon,
  SquaresFourIcon,
  Target,
  Users,
} from "@/lib/icons";
import type { AppUser } from "@/types/user";

export interface NavItem {
  title: string;
  href: string;
  icon: AppIcon;
  imageSrc?: string;
  /** Monochrome mark — rendered as CSS mask (e.g. app-logo-mark). */
  imageMask?: boolean;
  tone: SidebarAppIconTone;
  drawerTileClass: string;
}

const DASHBOARD_NAV_ITEM: NavItem = {
  title: "Dashboard",
  href: "/dashboard",
  icon: SquaresFourIcon,
  tone: "overview",
  drawerTileClass: "bg-blue-500",
};

const CUSTOMER_NAV_ITEM: NavItem = {
  title: "Customer",
  href: "/customers",
  icon: Users,
  tone: "media",
  drawerTileClass: "bg-sky-500",
};

const BROADCAST_NAV_ITEM: NavItem = {
  title: "Broadcast",
  href: "/broadcast",
  icon: Megaphone,
  tone: "notifications",
  drawerTileClass: "bg-orange-500",
};

const INBOX_NAV_ITEM: NavItem = {
  title: "Inbox",
  href: "/inbox",
  icon: MessageIcon,
  tone: "appearance",
  drawerTileClass: "bg-purple-500",
};

const LEADS_NAV_ITEM: NavItem = {
  title: "Leads",
  href: "/leads",
  icon: Target,
  tone: "scheduler",
  drawerTileClass: "bg-rose-500",
};

const DEPARTMENTS_NAV_ITEM: NavItem = {
  title: "Departments",
  href: "/departments",
  icon: Building2Icon,
  tone: "cms",
  drawerTileClass: "bg-violet-500",
};

const SALES_NAV_ITEM: NavItem = {
  title: "Sales",
  href: "/sales",
  icon: Briefcase,
  tone: "reports",
  drawerTileClass: "bg-green-500",
};

const ANALYTICS_NAV_ITEM: NavItem = {
  title: "Analytics",
  href: "/analytics",
  icon: BarChart3,
  tone: "overview",
  drawerTileClass: "bg-cyan-500",
};

const REPORTS_NAV_ITEM: NavItem = {
  title: "Reports",
  href: "/reports",
  icon: ListBulletClipboardIcon,
  tone: "reports",
  drawerTileClass: "bg-emerald-500",
};

const SETTINGS_NAV_ITEM: NavItem = {
  title: "Settings",
  href: "/settings",
  icon: GearSixIcon,
  tone: "settings",
  drawerTileClass: "bg-neutral-500",
};

const SCHEDULER_SUITE_NAV_ITEM: NavItem = {
  title: "Scheduler",
  href: SCHEDULER_APP_HREF,
  icon: CalendarDays,
  imageSrc: SCHEDULER_APP_LOGO_SRC,
  imageMask: true,
  tone: "scheduler",
  drawerTileClass: "bg-indigo-500",
};

const CMS_SYSTEM_NAV_ITEM: NavItem = {
  title: "CMS System",
  href: CMS_SYSTEM_HREF,
  icon: GlobeIcon,
  imageSrc: CMS_SYSTEM_LOGO_SRC,
  tone: "cms",
  drawerTileClass: "bg-sky-500",
};

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getNavItemsForUser(_user: AppUser): NavItem[] {
  return [
    DASHBOARD_NAV_ITEM,
    CUSTOMER_NAV_ITEM,
    BROADCAST_NAV_ITEM,
    INBOX_NAV_ITEM,
    LEADS_NAV_ITEM,
    DEPARTMENTS_NAV_ITEM,
    SALES_NAV_ITEM,
    ANALYTICS_NAV_ITEM,
    REPORTS_NAV_ITEM,
    SETTINGS_NAV_ITEM,
    SCHEDULER_SUITE_NAV_ITEM,
    CMS_SYSTEM_NAV_ITEM,
  ];
}

export function getPrimaryNavItemsForUser(user: AppUser): NavItem[] {
  return getNavItemsForUser(user).filter((item) =>
    ["/dashboard", "/customers", "/broadcast", "/inbox", "/leads"].includes(
      item.href,
    ),
  );
}

export function getSystemNavItemsForUser(user: AppUser): NavItem[] {
  return getNavItemsForUser(user).filter((item) =>
    [
      "/departments",
      "/sales",
      "/analytics",
      "/reports",
      "/settings",
      SCHEDULER_APP_HREF,
      CMS_SYSTEM_HREF,
    ].includes(item.href),
  );
}

const DRAWER_EXCLUDED_HREFS = new Set(["/dashboard"]);

export function getDrawerNavItemsForUser(user: AppUser): NavItem[] {
  return getNavItemsForUser(user).filter(
    (item) => !DRAWER_EXCLUDED_HREFS.has(item.href),
  );
}
