"use client";

import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { MobileBottomNavActiveIndicator } from "@/components/shared/mobile-bottom-nav-active-indicator";
import { MobileBottomNavLink } from "@/components/shared/mobile-bottom-nav-link";
import { MobileNavDrawer } from "@/components/shared/mobile-nav-drawer";
import {
  MOBILE_BOTTOM_NAV_INDICATOR_INSET_X,
  MOBILE_BOTTOM_NAV_INDICATOR_LAST_EXTRA_RIGHT,
} from "@/config/mobile-bottom-nav-motion";
import {
  isMobileBottomNavItemActive,
  MOBILE_BOTTOM_NAV_ITEM_WRAPPER,
  MOBILE_BOTTOM_NAV_ITEMS,
  MOBILE_BOTTOM_NAV_MENU_BUTTON,
  MOBILE_BOTTOM_NAV_PILL,
  MOBILE_BOTTOM_NAV_ROOT,
  MOBILE_CHROME_GLASS_SURFACE,
  shouldHideMobileBottomNav,
} from "@/config/mobile-nav";
import { MenuFilled } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types/user";

interface IndicatorMetrics {
  x: number;
  width: number;
}

function readIndicatorMetrics(
  pill: HTMLUListElement,
  item: HTMLLIElement | null,
  isLast: boolean,
): IndicatorMetrics | null {
  if (!item) {
    return null;
  }

  const pillRect = pill.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const insetX = MOBILE_BOTTOM_NAV_INDICATOR_INSET_X;
  const extraRight = isLast ? MOBILE_BOTTOM_NAV_INDICATOR_LAST_EXTRA_RIGHT : 0;

  return {
    x: itemRect.left - pillRect.left + insetX,
    width: itemRect.width - insetX * 2 - extraRight,
  };
}

interface MobileBottomNavProps {
  currentUser: AppUser;
  notificationsNewCount?: number;
  schedulerNewCount?: number;
}

export function MobileBottomNav({
  currentUser,
  notificationsNewCount = 0,
  schedulerNewCount = 0,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const pillRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const [indicator, setIndicator] = useState<IndicatorMetrics>({
    x: 0,
    width: 0,
  });
  const [indicatorReady, setIndicatorReady] = useState(false);

  const syncIndicator = useCallback(() => {
    const pill = pillRef.current;

    if (!pill) {
      return;
    }

    const activeIndex = MOBILE_BOTTOM_NAV_ITEMS.findIndex((item) =>
      isMobileBottomNavItemActive(pathname, item.href),
    );
    const activeItem =
      activeIndex >= 0 ? MOBILE_BOTTOM_NAV_ITEMS[activeIndex] : undefined;
    const node = activeItem ? itemRefs.current.get(activeItem.href) : null;
    const metrics = readIndicatorMetrics(
      pill,
      node ?? null,
      activeIndex === MOBILE_BOTTOM_NAV_ITEMS.length - 1,
    );

    if (!metrics) {
      return;
    }

    setIndicator(metrics);
    setIndicatorReady(true);
  }, [pathname]);

  useLayoutEffect(() => {
    syncIndicator();
  }, [syncIndicator]);

  useLayoutEffect(() => {
    const pill = pillRef.current;

    if (!pill) {
      return;
    }

    const observer = new ResizeObserver(() => {
      syncIndicator();
    });

    observer.observe(pill);

    return () => observer.disconnect();
  }, [syncIndicator]);

  if (shouldHideMobileBottomNav(pathname)) {
    return null;
  }

  return (
    <nav aria-label="Navigasi utama" className={MOBILE_BOTTOM_NAV_ROOT}>
      <ul
        ref={pillRef}
        className={cn(MOBILE_BOTTOM_NAV_PILL, MOBILE_CHROME_GLASS_SURFACE)}
      >
        <MobileBottomNavActiveIndicator
          visible={indicatorReady}
          width={indicator.width}
          x={indicator.x}
        />
        {MOBILE_BOTTOM_NAV_ITEMS.map((item) => {
          const active = isMobileBottomNavItemActive(pathname, item.href);
          const showBadge =
            item.href === "/scheduler" && schedulerNewCount > 0 && !active;

          return (
            <li
              className={MOBILE_BOTTOM_NAV_ITEM_WRAPPER}
              key={item.href}
              ref={(node) => {
                if (node) {
                  itemRefs.current.set(item.href, node);
                  return;
                }

                itemRefs.current.delete(item.href);
              }}
            >
              <MobileBottomNavLink
                active={active}
                item={item}
                showBadge={showBadge}
              />
            </li>
          );
        })}
      </ul>

      <MobileNavDrawer
        currentUser={currentUser}
        notificationsNewCount={notificationsNewCount}
        schedulerNewCount={schedulerNewCount}
        trigger={
          <button
            aria-label="Buka menu"
            className={cn(
              MOBILE_BOTTOM_NAV_MENU_BUTTON,
              MOBILE_CHROME_GLASS_SURFACE,
            )}
            type="button"
          >
            <MenuFilled className="size-6" />
          </button>
        }
      />
    </nav>
  );
}
