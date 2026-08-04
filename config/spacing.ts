/** Desktop-only viewport inset for the main content column.
 * Matches `--sidebar-container-gutter` (0.75rem / `p-3`).
 * No left padding — sidebar already provides the left gap via its right gutter.
 */
export const DESKTOP_OUTER_GUTTER = "md:py-3 md:pr-3";

/** Vertical stack spacing inside panels. */
export const STACK_GAP = "gap-3";

/** Inner padding inside glass shells. */
export const SHELL_PADDING = "p-3";

/**
 * Full-bleed content width for schedule detail — fills the shell inset.
 */
export const SCHEDULE_DETAIL_CONTENT_WIDTH = "w-full";

/**
 * Top padding so scroll content clears the floating AppHeader (desktop).
 * Mobile uses `MOBILE_CHROME_SCROLL_INSET_TOP` + large title instead.
 */
export const SHELL_HEADER_CLEARANCE = "md:pt-[4.5rem]";
