"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { PushSubscriptionButton } from "@/components/notifications/push-subscription-button";
import { SchedulerPageHelpContent } from "@/components/scheduler/scheduler-page-help-content";
import { DivisionScopeSwitcher } from "@/components/shared/division-scope-switcher";
import { HeaderActionsSlot } from "@/components/shared/header-actions";
import { HeaderBreadcrumbPills } from "@/components/shared/header-breadcrumb-pills";
import { HeaderFrostVeil } from "@/components/shared/header-frost-veil";
import { HeaderLeadingSlot } from "@/components/shared/header-leading";
import { HeaderPageName } from "@/components/shared/header-page-name";
import { HeaderTrailingSlot } from "@/components/shared/header-trailing";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { getBreadcrumbs } from "@/config/breadcrumbs";
import { getPageDescription } from "@/config/page-meta";
import { APP_GLASS_SURFACE } from "@/config/shared-surfaces";
import { useBreadcrumbContext } from "@/contexts/breadcrumb-context";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
  const pathname = usePathname();
  const { trail } = useBreadcrumbContext();
  const items = trail ?? getBreadcrumbs(pathname);
  const breadcrumbScrollRef = useRef<HTMLDivElement>(null);
  const currentLabel = items.at(-1)?.label ?? "";
  const pageDescription = getPageDescription(pathname);
  const isNested = items.length > 1;
  const isDashboard = pathname === "/dashboard";
  const isNotifications = pathname.startsWith("/notifications");

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-scroll breadcrumb when trail changes
  useEffect(() => {
    const el = breadcrumbScrollRef.current;
    if (!el) return;

    el.scrollLeft = el.scrollWidth;
  }, [currentLabel, items.length]);

  return (
    <header
      className={cn(
        "z-20 min-w-0",
        /* Desktop only — mobile uses MobileScrollChrome (large title + orbs). */
        "hidden md:block",
        "relative px-3 py-3 md:px-4 md:py-4",
        className,
      )}
      data-slot="app-header"
    >
      <HeaderFrostVeil variant={isDashboard ? "none" : "fade"} />

      <div
        className="relative flex flex-wrap items-center gap-2 md:flex-nowrap md:gap-2"
        data-slot="app-header-toolbar"
      >
        <HeaderLeadingSlot />

        {!isNested ? (
          <HeaderPageName
            description={pageDescription}
            helpContent={
              pathname === "/scheduler" ? (
                <SchedulerPageHelpContent />
              ) : undefined
            }
            helpTitle="Page guide"
            label={currentLabel}
            trailing={
              isNotifications ? (
                <PushSubscriptionButton appearance="icon" />
              ) : null
            }
          />
        ) : (
          <div
            ref={breadcrumbScrollRef}
            className="w-fit max-w-[min(100%,calc(100vw-8rem))] shrink-0 overflow-visible md:max-w-[min(100%,22rem)] lg:max-w-[min(100%,28rem)]"
          >
            <HeaderBreadcrumbPills items={items} />
          </div>
        )}

        <div className="order-3 ml-auto flex min-w-0 max-w-full flex-1 items-center justify-end gap-2 md:order-0 md:gap-1">
          {!isDashboard ? (
            <DivisionScopeSwitcher className="hidden lg:flex" />
          ) : null}
          <HeaderActionsSlot className="min-w-0 max-w-full" />
          <HeaderTrailingSlot />

          <div
            className={cn(
              "pointer-events-auto flex h-11 shrink-0 items-center gap-1 rounded-full p-1",
              APP_GLASS_SURFACE,
              "md:gap-1",
            )}
          >
            <NotificationBell />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
