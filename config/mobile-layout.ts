/**
 * Mobile-only layout helpers — pair with max-md overrides.
 * Desktop (`md`+) should not change during mobile-focused edits.
 */

/** Tailwind breakpoint: mobile = below md (768px). */
export const MOBILE_ONLY_PREFIX = "max-md" as const;

/** Desktop breakpoint prefix. */
export const DESKTOP_PREFIX = "md" as const;

/**
 * Prefix each utility with `max-md:` for mobile-only overrides.
 *
 * Caveat: Tailwind scans source text, so a prefix joined here is invisible to it
 * and the class ends up with no CSS. Only safe for utilities that also appear
 * literally as `max-md:*` somewhere, otherwise write the prefix inline.
 *
 * @example mobileOnly("px-3 gap-2") → "max-md:px-3 max-md:gap-2"
 */
export function mobileOnly(classes: string): string {
  return classes
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => `${MOBILE_ONLY_PREFIX}:${token}`)
    .join(" ");
}

/**
 * Shared mobile bottom sheet layout (wang floating squircle).
 * Sync with `.mobile-bottom-drawer-popup` in globals.css.
 */
export const MOBILE_BOTTOM_DRAWER_POPUP = "mobile-bottom-drawer-popup";

/** Taller max-height for multi-field form drawers. */
export const MOBILE_BOTTOM_DRAWER_POPUP_TALL =
  "mobile-bottom-drawer-popup--tall";
