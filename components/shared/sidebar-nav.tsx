"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { SidebarAppearanceButton } from "@/components/shared/sidebar-appearance-button";
import { SidebarCountBadge } from "@/components/shared/sidebar-count-badge";
import { SidebarNavGroup } from "@/components/shared/sidebar-nav-group";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  getPrimaryNavItemsForUser,
  getSystemNavItemsForUser,
  isNavItemActive,
} from "@/config/navigation";
import { SEPARATED_MENU_ITEM } from "@/config/sidebar";
import { useCloseMobileSidebar } from "@/hooks/use-close-mobile-sidebar";
import type { AppUser } from "@/types/user";

interface SidebarNavProps {
  currentUser: AppUser;
  notificationsNewCount?: number;
  schedulerNewCount?: number;
}

export function SidebarNav({
  currentUser,
  notificationsNewCount = 0,
  schedulerNewCount = 0,
}: SidebarNavProps) {
  const pathname = usePathname();
  const closeMobileSidebar = useCloseMobileSidebar();
  const primaryNavItems = getPrimaryNavItemsForUser(currentUser);
  const systemNavItems = getSystemNavItemsForUser(currentUser);
  const isOnSchedulerCalendar = pathname === "/scheduler";
  const isOnNotifications = pathname.startsWith("/notifications");
  const showSchedulerBadge = schedulerNewCount > 0 && !isOnSchedulerCalendar;
  const showNotificationsBadge =
    notificationsNewCount > 0 && !isOnNotifications;

  function getBadgeCount(href: string) {
    if (href === "/scheduler" && showSchedulerBadge) {
      return schedulerNewCount;
    }

    if (href === "/notifications" && showNotificationsBadge) {
      return notificationsNewCount;
    }

    return 0;
  }

  return (
    <div className="flex flex-col gap-2">
      <SidebarNavGroup id="menu" label="Menu">
        <SidebarMenu className="gap-1">
          {primaryNavItems.map((item) => {
            const badgeCount = getBadgeCount(item.href);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isNavItemActive(pathname, item.href)}
                  tooltip={item.title}
                  className={SEPARATED_MENU_ITEM}
                >
                  <Link href={item.href} onClick={closeMobileSidebar}>
                    <span className="relative shrink-0">
                      <SidebarAppIcon
                        icon={item.icon}
                        {...(item.imageSrc
                          ? {
                              imageSrc: item.imageSrc,
                              ...(item.imageMask ? { imageMask: true } : {}),
                            }
                          : {})}
                        tone={item.tone}
                      />
                      <SidebarCountBadge
                        count={badgeCount}
                        className="absolute -top-1 -right-1"
                      />
                    </span>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarNavGroup>

      <SidebarNavGroup id="system" label="System">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarAppearanceButton />
          </SidebarMenuItem>
          {systemNavItems.map((item) => {
            const badgeCount = getBadgeCount(item.href);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isNavItemActive(pathname, item.href)}
                  tooltip={item.title}
                  className={SEPARATED_MENU_ITEM}
                >
                  <Link href={item.href} onClick={closeMobileSidebar}>
                    <span className="relative shrink-0">
                      <SidebarAppIcon
                        icon={item.icon}
                        {...(item.imageSrc
                          ? {
                              imageSrc: item.imageSrc,
                              ...(item.imageMask ? { imageMask: true } : {}),
                            }
                          : {})}
                        tone={item.tone}
                      />
                      <SidebarCountBadge
                        count={badgeCount}
                        className="absolute -top-1 -right-1"
                      />
                    </span>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarNavGroup>
    </div>
  );
}
