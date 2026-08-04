"use client";

import { usePathname } from "next/navigation";
import {
  isWallpaperRoute,
  MOBILE_SOLID_PAGE_ROOT,
} from "@/config/page-surface";
import { cn } from "@/lib/utils";

interface AppContentSurfaceProps {
  children: React.ReactNode;
}

/**
 * Content column surface — wallpaper shows on home; solid bg covers it
 * on other mobile pages (wang-app pattern).
 */
export function AppContentSurface({ children }: AppContentSurfaceProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-1 flex-col overflow-hidden",
        !isWallpaperRoute(pathname) && MOBILE_SOLID_PAGE_ROOT,
      )}
    >
      {children}
    </div>
  );
}
