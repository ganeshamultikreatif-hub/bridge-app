"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { shouldHideMobileBottomNav } from "@/config/mobile-nav";

/**
 * Zero bottom-nav offset on secondary routes — spacers / FABs sit at safe area.
 * Mirrors wang `MobileBottomNavOffsetSync`.
 */
export function MobileBottomNavOffsetSync() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const hidden = shouldHideMobileBottomNav(pathname);

    if (hidden) {
      root.dataset.mobileBottomNav = "hidden";
      return;
    }

    delete root.dataset.mobileBottomNav;
  }, [pathname]);

  return null;
}
