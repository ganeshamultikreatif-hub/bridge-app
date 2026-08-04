/** Dead zone from idle — finger must pass this before PTR engages. */
export const MOBILE_PULL_REFRESH_SLOP_PX = 40;

/** Past-slop travel (after resistance) needed to arm refresh on release. */
export const MOBILE_PULL_REFRESH_ARM_PX = 56;

/** Cap on rubber-band translate while dragging. */
export const MOBILE_PULL_REFRESH_MAX_OFFSET_PX = 72;

/** Held translate while refresh runs (keeps spinner visible). */
export const MOBILE_PULL_REFRESH_HOLD_OFFSET_PX = 52;

/** Finger travel multiplier after slop — higher = stiffer pull. */
export const MOBILE_PULL_REFRESH_RESISTANCE = 0.55;
