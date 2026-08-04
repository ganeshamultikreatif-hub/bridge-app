"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactElement, useState, useTransition } from "react";
import { toast } from "sonner";
import { logoutAction } from "@/actions/auth.actions";
import { PushSubscriptionButton } from "@/components/notifications/push-subscription-button";
import {
  DrawerStackProvider,
  useRegisterDrawerCloser,
} from "@/components/shared/drawer-stack-context";
import { FadeScrollBody } from "@/components/shared/fade-scroll-body";
import { MobileNavAppearanceRow } from "@/components/shared/mobile-nav-appearance-row";
import { useProfileDialog } from "@/components/shared/profile-dialog-provider";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { APP_DIALOG_DRAWER_SURFACE } from "@/config/app-dialog-drawer";
import { getDrawerNavItemsForUser, isNavItemActive } from "@/config/navigation";
import { APP_GROUPED_SURFACE } from "@/config/shared-surfaces";
import { useCurrentUser } from "@/contexts/current-user-context";
import { useDrawerScrollLock } from "@/hooks/use-drawer-scroll-lock";
import { ChevronRight, LogOut, UserCircle } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types/user";

interface MobileNavDrawerProps {
  currentUser: AppUser;
  notificationsNewCount?: number;
  schedulerNewCount?: number;
  trigger: ReactElement;
}

const ROW_CLASS =
  "flex items-center gap-3 rounded-(--radius-inner) bg-(--grouped-surface) px-3 py-2.5 text-sm font-medium text-foreground transition-colors active:bg-muted";
const TILE_CLASS =
  "flex size-8 shrink-0 items-center justify-center rounded-[0.6rem] text-white [&_svg]:size-[18px]";

const DRAWER_SURFACE_CLASS = cn(APP_DIALOG_DRAWER_SURFACE, "px-4");

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

function getNavBadgeCount(
  href: string,
  options: {
    notificationsNewCount: number;
    pathname: string;
    schedulerNewCount: number;
  },
): number {
  if (
    href === "/scheduler" &&
    options.schedulerNewCount > 0 &&
    !isNavItemActive(options.pathname, href)
  ) {
    return options.schedulerNewCount;
  }

  if (
    href === "/notifications" &&
    options.notificationsNewCount > 0 &&
    !isNavItemActive(options.pathname, href)
  ) {
    return options.notificationsNewCount;
  }

  return 0;
}

function MobileNavDrawerContent({
  currentUser,
  notificationsNewCount = 0,
  schedulerNewCount = 0,
  trigger,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const { currentUser: liveUser } = useCurrentUser();
  const { openProfile } = useProfileDialog();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();
  const user = liveUser.id === currentUser.id ? liveUser : currentUser;
  const navItems = getDrawerNavItemsForUser(user);

  useDrawerScrollLock(open);
  useRegisterDrawerCloser(() => setOpen(false), open);

  function handleLogout() {
    setOpen(false);
    startLogout(async () => {
      toast.success("Berhasil logout");
      await logoutAction();
    });
  }

  return (
    <Drawer
      onOpenChange={setOpen}
      open={open}
      showSwipeHandle
      swipeDirection="down"
    >
      <DrawerTrigger render={trigger} />
      <DrawerContent className={DRAWER_SURFACE_CLASS}>
        <DrawerHeader className="shrink-0 px-0 pt-2 pb-3">
          <DrawerTitle className="sr-only">Menu navigasi</DrawerTitle>
          <div
            className={cn(APP_GROUPED_SURFACE, "flex items-center gap-3 p-3")}
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
              {getInitials(user.username)}
            </span>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold">{user.username}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
            <ThemeSwitcher />
          </div>
        </DrawerHeader>

        <FadeScrollBody
          className="min-h-0 flex-1 space-y-2 pb-0!"
          data-slot="drawer-scroll-body"
          resetKey={open}
        >
          {navItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const badgeCount = getNavBadgeCount(item.href, {
              notificationsNewCount,
              pathname,
              schedulerNewCount,
            });

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={ROW_CLASS}
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                <SidebarAppIcon
                  icon={item.icon}
                  size="dock"
                  tone={item.tone}
                  {...(item.imageSrc
                    ? {
                        imageSrc: item.imageSrc,
                        ...(item.imageMask ? { imageMask: true } : {}),
                      }
                    : {})}
                />
                <span className="flex-1">{item.title}</span>
                <span className="flex shrink-0 items-center gap-1.5">
                  {badgeCount > 0 ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                      {badgeCount}
                    </span>
                  ) : null}
                  {active && badgeCount === 0 ? (
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full bg-primary"
                    />
                  ) : (
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                  )}
                </span>
              </Link>
            );
          })}
        </FadeScrollBody>

        <div className="shrink-0 space-y-2 border-t border-border/60 pt-2">
          <MobileNavAppearanceRow />

          <button
            type="button"
            className={cn(ROW_CLASS, "w-full")}
            onClick={() => {
              setOpen(false);
              openProfile();
            }}
          >
            <SidebarAppIcon icon={UserCircle} size="dock" tone="profile" />
            <span className="flex-1 text-left">Pengaturan profil</span>
            <ChevronRight
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
          </button>

          <PushSubscriptionButton
            appearance="menuToggle"
            className={ROW_CLASS}
          />

          <Button
            className="h-auto w-full justify-start gap-3 rounded-(--radius-inner) bg-(--grouped-surface) px-3 py-2.5 text-sm font-medium text-destructive hover:bg-muted hover:text-destructive [&_svg]:size-4.5"
            disabled={isLoggingOut}
            onClick={handleLogout}
            type="button"
            variant="ghost"
          >
            <span className={cn(TILE_CLASS, "bg-red-500")}>
              <LogOut aria-hidden="true" />
            </span>
            Logout
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function MobileNavDrawer(props: MobileNavDrawerProps) {
  return (
    <DrawerStackProvider>
      <MobileNavDrawerContent {...props} />
    </DrawerStackProvider>
  );
}
