/** Hairline used by breadcrumb / header chrome — keep all companion surfaces on this. */
export const APP_SURFACE_BORDER = "border border-[var(--glass-shell-border)]";

export const APP_GLASS_SURFACE = `${APP_SURFACE_BORDER} bg-[var(--glass-fill)] shadow-[0_1px_3px_var(--glass-shell-shadow),inset_0_1px_0_var(--glass-shell-specular)] backdrop-blur-[var(--glass-backdrop-blur)] backdrop-saturate-[var(--glass-backdrop-saturate)]`;

export const APP_PANEL_SURFACE = `rounded-[var(--radius-outer)] ${APP_SURFACE_BORDER} bg-card/92 shadow-[0_8px_28px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-[var(--glass-backdrop-blur)] supports-backdrop-filter:bg-card/80 dark:shadow-[0_10px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)]`;

export const APP_GROUPED_SURFACE = `rounded-[calc(var(--radius-outer)-0.125rem)] ${APP_SURFACE_BORDER} bg-[var(--grouped-surface)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-[calc(var(--glass-backdrop-blur)*0.7)]`;

export const APP_TOOLBAR_SURFACE = `rounded-[var(--radius-outer)] ${APP_SURFACE_BORDER} bg-[var(--grouped-surface)] p-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-[calc(var(--glass-backdrop-blur)*0.7)]`;

export const APP_FLOATING_SURFACE = `${APP_SURFACE_BORDER} bg-card/50 shadow-[0_12px_30px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-[var(--glass-backdrop-blur)] supports-backdrop-filter:bg-card/50`;
