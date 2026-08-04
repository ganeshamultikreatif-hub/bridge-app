"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppLogo } from "@/components/shared/app-logo";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { SidebarCountBadge } from "@/components/shared/sidebar-count-badge";
import {
  SidebarDock,
  SidebarDockItem,
  useSidebarDockTooltipVisible,
} from "@/components/shared/sidebar-dock";
import { SidebarDockAccountFolder } from "@/components/shared/sidebar-dock-account-folder";
import { useSidebar } from "@/components/ui/sidebar";
import { APP_NAME } from "@/config/app";
import {
  getPrimaryNavItemsForUser,
  getSystemNavItemsForUser,
  isNavItemActive,
} from "@/config/navigation";
import {
  getSidebarAppMarkLogoClasses,
  getSidebarAppMarkShellClasses,
  SIDEBAR_APP_MARK_LOGO_SIZE,
  SIDEBAR_DOCK_ACTIVE_DOT_CLASS,
  SIDEBAR_DOCK_LABEL_CLASS,
  SIDEBAR_DOCK_TRIGGER_CLASS,
} from "@/config/sidebar";
import { useOptionalAppearance } from "@/contexts/appearance-context";
import { SidebarIcon } from "@/lib/icons";
import { searchNavItem } from "@/lib/sidebar/search";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types/user";

function DockLabel({ label }: { label: string }) {
  const visible = useSidebarDockTooltipVisible();

  return (
    <span
      className={cn(
        SIDEBAR_DOCK_LABEL_CLASS,
        visible ? "opacity-100" : "opacity-0",
      )}
      aria-hidden={!visible}
    >
      {label}
    </span>
  );
}

function DockActiveDot({ active }: { active: boolean }) {
  if (!active) {
    return null;
  }

  return <span aria-hidden className={SIDEBAR_DOCK_ACTIVE_DOT_CLASS} />;
}

interface DockAppButtonProps {
  href?: string;
  label: string;
  isActive?: boolean;
  onClick?: (() => void) | undefined;
  children: React.ReactNode;
}

function DockAppButton({
  href,
  label,
  isActive = false,
  onClick,
  children,
}: DockAppButtonProps) {
  return (
    <div className="relative flex items-center justify-center">
      {href ? (
        <Link
          href={href}
          aria-label={label}
          aria-current={isActive ? "page" : undefined}
          className={SIDEBAR_DOCK_TRIGGER_CLASS}
        >
          {children}
        </Link>
      ) : (
        <button
          type="button"
          aria-label={label}
          className={SIDEBAR_DOCK_TRIGGER_CLASS}
          onClick={onClick}
        >
          {children}
        </button>
      )}
      <DockLabel label={label} />
      <DockActiveDot active={isActive} />
    </div>
  );
}

interface SidebarCollapsedDockProps {
  currentUser: AppUser;
  notificationsNewCount?: number;
  schedulerNewCount?: number;
  onlineCount?: number;
  onOpenProfile?: () => void;
  onOpenPresence?: () => void;
  onOpenSearch?: () => void;
  isProfileOpen?: boolean;
  isSearchOpen?: boolean;
}

export function SidebarCollapsedDock({
  currentUser,
  notificationsNewCount = 0,
  schedulerNewCount = 0,
  onlineCount = 0,
  onOpenProfile,
  onOpenPresence,
  onOpenSearch,
  isProfileOpen = false,
  isSearchOpen = false,
}: SidebarCollapsedDockProps) {
  const appearance = useOptionalAppearance();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const primaryNavItems = getPrimaryNavItemsForUser(currentUser);
  const systemNavItems = getSystemNavItemsForUser(currentUser);
  const isOnSchedulerCalendar = pathname === "/scheduler";
  const isOnNotifications = pathname.startsWith("/notifications");
  const showSchedulerBadge = schedulerNewCount > 0 && !isOnSchedulerCalendar;
  const showNotificationsBadge =
    notificationsNewCount > 0 && !isOnNotifications;

  let index = 0;

  const notificationsItem = systemNavItems.find(
    (item) => item.href === "/notifications",
  );
  const settingsItem = systemNavItems.find((item) => item.href === "/settings");
  const otherSystemItems = systemNavItems.filter(
    (item) => item.href !== "/notifications" && item.href !== "/settings",
  );

  return (
    <SidebarDock>
      <SidebarDockItem index={index++}>
        <DockAppButton label={APP_NAME}>
          <span
            className={cn(
              getSidebarAppMarkShellClasses(
                "dock",
                appearance?.appIconStyle ?? "colored",
                "brand",
              ),
              "overflow-hidden",
              getSidebarAppMarkLogoClasses(
                appearance?.appIconStyle ?? "colored",
              ),
            )}
          >
            <AppLogo className={SIDEBAR_APP_MARK_LOGO_SIZE} />
          </span>
        </DockAppButton>
      </SidebarDockItem>

      <SidebarDockItem index={index++}>
        <DockAppButton label="Expand sidebar" onClick={toggleSidebar}>
          <SidebarAppIcon icon={SidebarIcon} tone="collapse" size="dock" />
        </DockAppButton>
      </SidebarDockItem>

      <SidebarDockItem index={index++}>
        <DockAppButton
          label={searchNavItem.title}
          isActive={isSearchOpen}
          onClick={onOpenSearch}
        >
          <SidebarAppIcon
            icon={searchNavItem.icon}
            tone={searchNavItem.tone}
            size="dock"
          />
        </DockAppButton>
      </SidebarDockItem>

      {primaryNavItems.map((item) => {
        const itemIndex = index++;
        const isActive = isNavItemActive(pathname, item.href);
        const badgeCount =
          item.href === "/scheduler" && showSchedulerBadge
            ? schedulerNewCount
            : 0;

        return (
          <SidebarDockItem key={item.href} index={itemIndex}>
            <DockAppButton
              href={item.href}
              label={item.title}
              isActive={isActive}
            >
              <span className="relative block">
                <SidebarAppIcon
                  icon={item.icon}
                  tone={item.tone}
                  size="dock"
                  {...(item.imageSrc
                    ? {
                        imageSrc: item.imageSrc,
                        ...(item.imageMask ? { imageMask: true } : {}),
                      }
                    : {})}
                />
                <SidebarCountBadge
                  count={badgeCount}
                  className="absolute top-0 right-0 z-30 translate-x-1/4 -translate-y-1/4"
                />
              </span>
            </DockAppButton>
          </SidebarDockItem>
        );
      })}

      {notificationsItem ? (
        <SidebarDockItem index={index++}>
          <div className="relative size-9 overflow-visible">
            <DockAppButton
              href={notificationsItem.href}
              label={notificationsItem.title}
              isActive={isNavItemActive(pathname, notificationsItem.href)}
            >
              <SidebarAppIcon
                icon={notificationsItem.icon}
                tone={notificationsItem.tone}
                size="dock"
              />
            </DockAppButton>
            <SidebarCountBadge
              count={showNotificationsBadge ? notificationsNewCount : 0}
              className="absolute top-0 right-0 z-30 translate-x-1/4 -translate-y-1/4"
            />
          </div>
        </SidebarDockItem>
      ) : null}

      {otherSystemItems.map((item) => {
        const itemIndex = index++;
        const isActive = isNavItemActive(pathname, item.href);

        return (
          <SidebarDockItem key={item.href} index={itemIndex}>
            <DockAppButton
              href={item.href}
              label={item.title}
              isActive={isActive}
            >
              <SidebarAppIcon
                icon={item.icon}
                tone={item.tone}
                size="dock"
                {...(item.imageSrc
                  ? {
                      imageSrc: item.imageSrc,
                      ...(item.imageMask ? { imageMask: true } : {}),
                    }
                  : {})}
              />
            </DockAppButton>
          </SidebarDockItem>
        );
      })}

      <SidebarDockItem index={index++}>
        <SidebarDockAccountFolder
          currentUser={currentUser}
          settingsHref={settingsItem?.href ?? "/settings"}
          settingsActive={
            settingsItem ? isNavItemActive(pathname, settingsItem.href) : false
          }
          isProfileOpen={isProfileOpen}
          onlineCount={onlineCount}
          onOpenProfile={onOpenProfile}
          onOpenPresence={onOpenPresence}
        />
      </SidebarDockItem>
    </SidebarDock>
  );
}
