"use client";

import { usePathname } from "next/navigation";
import { type RefObject, useRef } from "react";
import { MobilePageTitle } from "@/components/shared/mobile-page-title";
import { useSyncMobileScrollChrome } from "@/components/shared/mobile-scroll-chrome-provider";
import {
  getMobilePageTitle,
  MOBILE_WALLPAPER_PAGE_TITLE,
} from "@/config/mobile-chrome";
import { isWallpaperRoute } from "@/config/page-surface";
import { useMobileLargeTitleScroll } from "@/hooks/use-mobile-large-title-scroll";

interface MobilePageChromeProps {
  scrollRef: RefObject<HTMLElement | null>;
}

/**
 * wang MobilePageTitle in the scroll body + syncs compact title / blur
 * to the fixed MobileScrollChrome. Hidden on `md+` via CSS.
 */
export function MobilePageChrome({ scrollRef }: MobilePageChromeProps) {
  const pathname = usePathname();
  const title = getMobilePageTitle(pathname);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { showBlur, showCompactTitle } = useMobileLargeTitleScroll(
    () => scrollRef.current,
    titleRef,
    { observeKey: pathname },
  );

  useSyncMobileScrollChrome(title, showBlur, showCompactTitle);

  return (
    <MobilePageTitle
      ref={titleRef}
      {...(isWallpaperRoute(pathname)
        ? { className: MOBILE_WALLPAPER_PAGE_TITLE }
        : {})}
    >
      {title}
    </MobilePageTitle>
  );
}
