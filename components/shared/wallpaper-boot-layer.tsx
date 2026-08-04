import {
  WALLPAPER_BOOT_LAYER_ID,
  WALLPAPER_BOOT_MASK_ID,
} from "@/lib/wallpaper/paint-cache";

/**
 * Fixed layers painted by the blocking bootstrap script before React hydrates.
 * WallpaperBackground keeps these in sync after load — do not remove on remount.
 *
 * `suppressHydrationWarning` is required: the bootstrap script mutates inline
 * styles on these nodes before hydration, so SSR markup will never match.
 */
export function WallpaperBootLayer() {
  return (
    <>
      <div
        id={WALLPAPER_BOOT_LAYER_ID}
        aria-hidden
        suppressHydrationWarning
        className="pointer-events-none fixed top-0 right-0 left-0 z-0 h-(--app-height,100dvh) transition-[background-color,background-image] duration-500 ease-out"
      />
      <div
        id={WALLPAPER_BOOT_MASK_ID}
        aria-hidden
        suppressHydrationWarning
        className="pointer-events-none fixed top-0 right-0 left-0 z-0 h-(--app-height,100dvh) transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
    </>
  );
}
