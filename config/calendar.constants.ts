import type { ScheduleStatus } from "@/types/schedule";

export const WEEKDAYS = [
  { id: "sun", label: "S" },
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "T" },
  { id: "fri", label: "F" },
  { id: "sat", label: "S" },
] as const;

export const MONTH_OPTIONS = [
  { label: "January", value: "0" },
  { label: "February", value: "1" },
  { label: "March", value: "2" },
  { label: "April", value: "3" },
  { label: "May", value: "4" },
  { label: "June", value: "5" },
  { label: "July", value: "6" },
  { label: "August", value: "7" },
  { label: "September", value: "8" },
  { label: "October", value: "9" },
  { label: "November", value: "10" },
  { label: "December", value: "11" },
] as const;

export const PAST_DATE_MESSAGE =
  "Kamu tidak bisa menambahkan jadwal ke tanggal yang sudah lewat";

export const STATUS_CLASSES: Record<ScheduleStatus, string> = {
  todo: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  in_progress:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  ready_for_review:
    "bg-cyan-50 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300",
  ready_to_publish:
    "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  published:
    "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  done: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  complete:
    "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300",
};

export const STATUS_BAR_CLASSES: Record<ScheduleStatus, string> = {
  todo: "bg-slate-400 dark:bg-slate-500",
  in_progress: "bg-blue-500 dark:bg-blue-400",
  ready_for_review: "bg-cyan-500 dark:bg-cyan-400",
  ready_to_publish: "bg-amber-500 dark:bg-amber-400",
  published: "bg-violet-500 dark:bg-violet-400",
  done: "bg-emerald-500 dark:bg-emerald-400",
  complete: "bg-green-500 dark:bg-green-400",
};

export const SCHEDULE_ITEM_IN_PROGRESS =
  "border-blue-100 bg-blue-50/80 text-blue-800 hover:bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-950/50";

export const SCHEDULE_ITEM_OVERDUE =
  "border-red-100 bg-red-50/80 text-red-800 hover:bg-red-50 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/50";

/** Meeting room awaiting confirmation (room in use / meeting finished). */
export const SCHEDULE_ITEM_MEETING_ATTENTION =
  "border-amber-100 bg-amber-50/80 text-amber-900 hover:bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-950/50";

export const OVERDUE_BADGE_CLASS =
  "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300";

export const MEETING_ATTENTION_BADGE_CLASS =
  "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200";

export const OVERDUE_PANEL_CLASS =
  "border-red-100 bg-red-50/80 dark:border-red-900 dark:bg-red-950/30";

export const MEETING_ATTENTION_PANEL_CLASS =
  "border-amber-200/80 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/30";

export const INDONESIA_RED_DAY_BG =
  "bg-red-50/50 hover:bg-red-50/70 dark:bg-red-950/20 dark:hover:bg-red-950/30";

export const INDONESIA_RED_DAY_NUMBER =
  "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300";

export const WIDGET_STAT_CLASSES = {
  todo: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  in_progress:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  ready_for_review:
    "bg-cyan-50 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300",
  ready_to_publish:
    "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  published:
    "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  done: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  complete:
    "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300",
} as const;

export const ROLE_BADGE_SUPER_ADMIN =
  "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300";

export const ROLE_BADGE_USER =
  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

export const ROLE_BADGE_GUEST =
  "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300";

export const UPCOMING_SOON_BADGE_CLASS =
  "bg-pink-50 text-pink-700 ring-pink-100 dark:bg-pink-950/50 dark:text-pink-300 dark:ring-pink-900";

/** Sosmed publish within this window shows the "Segera" indicator. */
export const UPCOMING_SOON_WINDOW_MS = 60 * 60 * 1000;

export const SCHEDULE_ITEM_UPCOMING_SOON =
  "ring-1 ring-inset ring-pink-200/80 bg-pink-50/60 dark:ring-pink-900/70 dark:bg-pink-950/25";

export const CALENDAR_DAY_UPCOMING_SOON_COUNT_CLASS =
  "bg-pink-50 text-pink-700 ring-1 ring-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:ring-pink-900";

export const NEW_BADGE_CLASS =
  "bg-red-200 text-red-500 dark:bg-red-950 dark:text-red-400";

export const OVERDUE_ALERT_CARD =
  "rounded-[1.5rem] border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950";

export const INDONESIA_EVENTS_PANEL =
  "rounded-[1.5rem] border border-red-100 bg-red-50/60 dark:border-red-900 dark:bg-red-950/20";
