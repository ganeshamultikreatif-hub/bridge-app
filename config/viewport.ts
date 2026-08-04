/**
 * Full-bleed app frame height.
 *
 * Default `100dvh` is correct in mobile Safari (tracks URL bar).
 * iOS standalone PWAs lie about `svh`/`dvh` (short by safe-area-inset-top),
 * leaving a white gap under the bottom nav — bootstrap overrides to `100vh`.
 *
 * @see https://bugs.webkit.org/show_bug.cgi?id=254868
 */
export const APP_HEIGHT_CSS_VAR = "--app-height";

/** Shell / body frame — prefer over raw `h-svh` / `min-h-svh`. */
export const APP_FRAME_HEIGHT =
  "h-[var(--app-height,100dvh)] max-h-[var(--app-height,100dvh)]";

export const APP_FRAME_MIN_HEIGHT = "min-h-[var(--app-height,100dvh)]";
