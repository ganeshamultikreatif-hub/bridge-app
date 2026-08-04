"use client";

import Link from "next/link";
import {
  MOBILE_BOTTOM_NAV_GLYPH_TRANSITION,
  MOBILE_BOTTOM_NAV_LABEL_TRANSITION,
} from "@/config/mobile-bottom-nav-motion";
import {
  MOBILE_BOTTOM_NAV_GLYPH_SLOT,
  MOBILE_BOTTOM_NAV_ITEM,
  MOBILE_BOTTOM_NAV_ITEM_ACTIVE,
  MOBILE_BOTTOM_NAV_ITEM_IDLE,
  MOBILE_BOTTOM_NAV_LABEL_ACTIVE,
  type MobileBottomNavItem,
} from "@/config/mobile-nav";
import { cn } from "@/lib/utils";

interface MobileBottomNavLinkProps {
  item: MobileBottomNavItem;
  active: boolean;
  showBadge?: boolean;
}

export function MobileBottomNavLink({
  item,
  active,
  showBadge = false,
}: MobileBottomNavLinkProps) {
  const IconComponent = item.icon;

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        MOBILE_BOTTOM_NAV_ITEM,
        "w-full",
        active ? MOBILE_BOTTOM_NAV_ITEM_ACTIVE : MOBILE_BOTTOM_NAV_ITEM_IDLE,
      )}
      href={item.href}
      prefetch
      scroll={false}
    >
      <span className={MOBILE_BOTTOM_NAV_GLYPH_SLOT}>
        <IconComponent
          aria-hidden
          className={cn(
            MOBILE_BOTTOM_NAV_GLYPH_TRANSITION,
            active && "scale-[1.04] text-primary",
          )}
        />
        {showBadge ? (
          <span
            aria-hidden
            className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary ring-2 ring-white dark:ring-transparent"
          />
        ) : null}
      </span>
      <span
        className={cn(
          MOBILE_BOTTOM_NAV_LABEL_TRANSITION,
          active && MOBILE_BOTTOM_NAV_LABEL_ACTIVE,
        )}
      >
        {item.title}
      </span>
    </Link>
  );
}
