"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ChangelogDialog } from "@/components/changelog/changelog-dialog";
import { LiveNotifications } from "@/components/notifications/live-notifications";
import { AppContentSurface } from "@/components/shared/app-content-surface";
import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppSidebarProvider } from "@/components/shared/app-sidebar-provider";
import { AppearanceDrawerProvider } from "@/components/shared/appearance-drawer-provider";
import { DashboardFrostVeil } from "@/components/shared/dashboard-frost-veil";
import { FixedViewportPortal } from "@/components/shared/fixed-viewport-portal";
import { GlassPanel } from "@/components/shared/glass-panel";
import { HeaderActionsProvider } from "@/components/shared/header-actions";
import { HeaderLeadingProvider } from "@/components/shared/header-leading";
import { HeaderTrailingProvider } from "@/components/shared/header-trailing";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { MobileBottomNavOffsetSync } from "@/components/shared/mobile-bottom-nav-offset-sync";
import { MobilePageChrome } from "@/components/shared/mobile-page-chrome";
import { MobilePullRefreshSpinner } from "@/components/shared/mobile-pull-refresh-spinner";
import { MobileScrollChrome } from "@/components/shared/mobile-scroll-chrome";
import { MobileScrollChromeProvider } from "@/components/shared/mobile-scroll-chrome-provider";
import { ProfileDialogProvider } from "@/components/shared/profile-dialog-provider";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  DASHBOARD_PAGE_ROOT,
  DASHBOARD_PAGE_SCROLL,
  DASHBOARD_PAGE_SCROLL_BOTTOM,
  DASHBOARD_PAGE_SCROLL_INSET,
} from "@/config/dashboard-page";
import {
  MOBILE_CHROME_SCROLL_INSET_BOTTOM,
  MOBILE_CHROME_SCROLL_INSET_TOP,
  MOBILE_SCROLL_BOTTOM_SPACER,
} from "@/config/mobile-chrome";
import {
  isWallpaperRoute,
  usesCustomDesktopPageShell,
} from "@/config/page-surface";
import {
  SEPARATED_SIDEBAR_ICON_WIDTH,
  SEPARATED_SIDEBAR_WIDTH,
} from "@/config/sidebar";
import {
  SOLID_PAGE_INNER,
  SOLID_PAGE_SCROLL,
  SOLID_PAGE_SCROLL_BOTTOM,
  SOLID_PAGE_SCROLL_INSET,
  SOLID_PAGE_SHELL,
} from "@/config/solid-page";
import { DESKTOP_OUTER_GUTTER, SHELL_HEADER_CLEARANCE } from "@/config/spacing";
import { APP_FRAME_HEIGHT } from "@/config/viewport";
import { BrandsProvider } from "@/contexts/brands-context";
import { BreadcrumbProvider } from "@/contexts/breadcrumb-context";
import { CurrentUserProvider } from "@/contexts/current-user-context";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { cn } from "@/lib/utils";
import type { AppBrand } from "@/types/brand";
import type { AppUser } from "@/types/user";

interface DashboardShellProps {
  brands: AppBrand[];
  children: React.ReactNode;
  currentUser: AppUser;
  notificationsNewCount?: number;
  schedulerNewCount?: number;
}

function ShellScrollMain({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollRef = useRef<HTMLElement>(null);
  const { pullProgress, pullOffsetPx, isRefreshing } =
    usePullToRefresh(scrollRef);

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
      <MobilePullRefreshSpinner
        offsetPx={pullOffsetPx}
        progress={pullProgress}
        refreshing={isRefreshing}
      />
      <main
        ref={scrollRef}
        className={cn(
          className,
          MOBILE_CHROME_SCROLL_INSET_TOP,
          MOBILE_CHROME_SCROLL_INSET_BOTTOM,
          SHELL_HEADER_CLEARANCE,
        )}
      >
        <MobilePageChrome scrollRef={scrollRef} />
        {children}
        {/*
          See-through bottom nav: scroll viewport is full-height (no shell
          pb-mobile-nav). Spacer lets the last widgets clear the pill and
          scroll behind the frosted glass.
        */}
        <div aria-hidden className={MOBILE_SCROLL_BOTTOM_SPACER} />
      </main>
    </div>
  );
}

export function DashboardShell({
  brands,
  children,
  currentUser,
  notificationsNewCount = 0,
  schedulerNewCount = 0,
}: DashboardShellProps) {
  const pathname = usePathname();
  const showWallpaper = isWallpaperRoute(pathname);
  const customDesktopPageShell = usesCustomDesktopPageShell(pathname);

  return (
    <CurrentUserProvider currentUser={currentUser}>
      <BrandsProvider brands={brands}>
        <BreadcrumbProvider>
          <HeaderActionsProvider>
            <HeaderLeadingProvider>
              <HeaderTrailingProvider>
                <AppearanceDrawerProvider>
                  <ProfileDialogProvider>
                    <MobileScrollChromeProvider>
                      <AppSidebarProvider
                        className={cn(
                            "relative z-10 flex min-h-0 w-full overflow-hidden bg-transparent",
                            APP_FRAME_HEIGHT,
                          )}
                          style={
                            {
                              "--sidebar-width": SEPARATED_SIDEBAR_WIDTH,
                              "--sidebar-width-icon":
                                SEPARATED_SIDEBAR_ICON_WIDTH,
                            } as React.CSSProperties
                          }
                        >
                          <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
                            {showWallpaper ? <DashboardFrostVeil /> : null}
                            <AppSidebar
                              currentUser={currentUser}
                              notificationsNewCount={notificationsNewCount}
                              schedulerNewCount={schedulerNewCount}
                            />
                            <SidebarInset
                              className={cn(
                                "relative flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent",
                                !customDesktopPageShell && DESKTOP_OUTER_GUTTER,
                              )}
                            >
                              <AppContentSurface>
                                {/*
                      Full-height scroll on mobile — no pb-mobile-nav so home
                      content can pass under the frosted bottom nav.
                      Clearance lives in MOBILE_SCROLL_BOTTOM_SPACER.
                    */}
                                <div className="flex min-h-0 flex-1 flex-col overflow-hidden max-md:overflow-visible">
                                  {showWallpaper ? (
                                    <div className={DASHBOARD_PAGE_ROOT}>
                                      <AppHeader className="pointer-events-none absolute inset-x-0 top-0" />
                                      <ShellScrollMain
                                        className={cn(
                                          DASHBOARD_PAGE_SCROLL,
                                          DASHBOARD_PAGE_SCROLL_INSET,
                                          DASHBOARD_PAGE_SCROLL_BOTTOM,
                                        )}
                                      >
                                        {children}
                                      </ShellScrollMain>
                                    </div>
                                  ) : (
                                    <GlassPanel className={SOLID_PAGE_SHELL}>
                                      {/*
                            Desktop: glass card clips to radius.
                            Mobile: SOLID_PAGE_SHELL / INNER use max-md:contents
                            so there is no clipping container (wang pattern).
                          */}
                                      <div className={SOLID_PAGE_INNER}>
                                        <AppHeader className="pointer-events-none absolute inset-x-0 top-0" />
                                        <ShellScrollMain
                                          className={cn(
                                            SOLID_PAGE_SCROLL,
                                            SOLID_PAGE_SCROLL_INSET,
                                            SOLID_PAGE_SCROLL_BOTTOM,
                                          )}
                                        >
                                          {children}
                                        </ShellScrollMain>
                                      </div>
                                    </GlassPanel>
                                  )}
                                </div>
                              </AppContentSurface>
                            </SidebarInset>
                            <FixedViewportPortal>
                              <MobileScrollChrome />
                              <MobileBottomNavOffsetSync />
                              <MobileBottomNav
                                currentUser={currentUser}
                                notificationsNewCount={notificationsNewCount}
                                schedulerNewCount={schedulerNewCount}
                              />
                            </FixedViewportPortal>
                            <LiveNotifications />
                            <ChangelogDialog />
                          </div>
                        </AppSidebarProvider>
                      </MobileScrollChromeProvider>
                    </ProfileDialogProvider>
                  </AppearanceDrawerProvider>
                </HeaderTrailingProvider>
              </HeaderLeadingProvider>
            </HeaderActionsProvider>
          </BreadcrumbProvider>
      </BrandsProvider>
    </CurrentUserProvider>
  );
}
