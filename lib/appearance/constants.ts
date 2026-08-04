export const APPEARANCE_STORAGE_KEYS = {
  appearancePrefix: "scheduler-appearance",
  /** @deprecated migrated to per-user keys */
  legacyAccentColor: "scheduler-accent-color",
} as const;

/** Non-httpOnly cookie so the root bootstrap script can resolve per-user theme. */
export const APPEARANCE_USER_COOKIE = "scheduler_appearance_uid";
