import { PAGE_META } from "@/config/page-meta";
import { SETTINGS_TAB_META, type SettingsTabId } from "@/config/settings-tabs";

export type BreadcrumbItem = {
  description?: string;
  label: string;
  href?: string;
};

const SCHEDULE_DETAIL_PATTERN = /^\/scheduler\/([^/]+)$/;

export function buildScheduleDetailBreadcrumbs(
  title: string,
): BreadcrumbItem[] {
  return [{ label: "Scheduler", href: "/scheduler" }, { label: title }];
}

export function buildSettingsTabBreadcrumbs(
  tab: SettingsTabId,
): BreadcrumbItem[] {
  const settingsMeta = PAGE_META["/settings"];
  const tabMeta = SETTINGS_TAB_META[tab];

  return [
    {
      label: settingsMeta?.title ?? "Settings",
      href: "/settings",
    },
    {
      label: tabMeta.title,
      description: tabMeta.description,
    },
  ];
}

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pageMeta = PAGE_META[pathname];

  if (pageMeta) {
    return [{ label: pageMeta.title }];
  }

  if (pathname === "/customers/new") {
    return [
      { label: "Customer", href: "/customers" },
      { label: "Add Contact" },
    ];
  }

  const customerDetailMatch = /^\/customers\/([^/]+)$/.exec(pathname);
  if (customerDetailMatch && customerDetailMatch[1] !== "new") {
    return [
      { label: "Customer", href: "/customers" },
      { label: "Customer Detail" },
    ];
  }

  if (pathname === "/broadcast/new") {
    return [
      { label: "Broadcast", href: "/broadcast" },
      { label: "Create Broadcast" },
    ];
  }

  const broadcastDetailMatch = /^\/broadcast\/([^/]+)$/.exec(pathname);
  if (broadcastDetailMatch && broadcastDetailMatch[1] !== "new") {
    return [
      { label: "Broadcast", href: "/broadcast" },
      { label: "Broadcast Detail" },
    ];
  }

  if (pathname === "/scheduler/new") {
    return [
      { label: "Scheduler", href: "/scheduler" },
      { label: "Tambah jadwal" },
    ];
  }

  const scheduleDetailMatch = SCHEDULE_DETAIL_PATTERN.exec(pathname);
  if (scheduleDetailMatch && scheduleDetailMatch[1] !== "new") {
    return buildScheduleDetailBreadcrumbs("Detail jadwal");
  }

  const scheduleEditMatch = /^\/scheduler\/([^/]+)\/edit$/.exec(pathname);
  if (scheduleEditMatch) {
    return [
      { label: "Scheduler", href: "/scheduler" },
      {
        label: "Detail jadwal",
        href: `/scheduler/${scheduleEditMatch[1]}`,
      },
      { label: "Edit jadwal" },
    ];
  }

  return [{ label: "Dashboard" }];
}
