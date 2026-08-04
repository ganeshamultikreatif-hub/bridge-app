/** Home / dashboard — only route where wallpaper shows through. */
export const HOME_ROUTE = "/dashboard";

const WALLPAPER_ROUTES = [HOME_ROUTE] as const;

/** Wallpaper bleeds through on home only (mobile + desktop). */
export function isWallpaperRoute(pathname: string): boolean {
  return WALLPAPER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

/** Home manages its own desktop gutter (no GlassPanel). */
export function usesCustomDesktopPageShell(pathname: string): boolean {
  return isWallpaperRoute(pathname);
}

/** Solid theme background — mobile only (non-home pages). */
export const MOBILE_SOLID_PAGE_ROOT = "max-md:bg-background";
