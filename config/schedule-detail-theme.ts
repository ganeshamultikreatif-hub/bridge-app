import type {
  SchedulePriority,
  ScheduleStatus,
  ScheduleType,
} from "@/types/schedule";

/** Semantic color tones for detail cards — solid fills only (no translucent washes). */
export type DetailTone =
  | "neutral"
  | "sky"
  | "violet"
  | "cyan"
  | "amber"
  | "emerald"
  | "teal"
  | "rose"
  | "orange"
  | "blue"
  | "indigo";

export type DetailAccent = "default" | "subtle";

/** Shared card chrome — every detail section uses the same solid surface. */
const DETAIL_CARD_SECTION = "bg-card ring-1 ring-border shadow-sm";
const DETAIL_CARD_CHIP = "bg-muted ring-1 ring-border";
const DETAIL_CARD_TITLE = "text-muted-foreground";

export const DETAIL_TONE: Record<
  DetailTone,
  {
    badge: string;
    chip: string;
    icon: string;
    section: string;
    title: string;
  }
> = {
  neutral: {
    icon: "bg-muted text-muted-foreground ring-1 ring-border",
    chip: DETAIL_CARD_CHIP,
    section: DETAIL_CARD_SECTION,
    title: DETAIL_CARD_TITLE,
    badge: "bg-muted text-foreground ring-1 ring-border",
  },
  sky: {
    icon: "bg-sky-100 text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900 dark:text-sky-300 dark:ring-sky-800",
    chip: DETAIL_CARD_CHIP,
    section: DETAIL_CARD_SECTION,
    title: DETAIL_CARD_TITLE,
    badge:
      "bg-sky-100 text-sky-800 ring-1 ring-sky-200 dark:bg-sky-900 dark:text-sky-200 dark:ring-sky-800",
  },
  violet: {
    icon: "bg-violet-100 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-900 dark:text-violet-300 dark:ring-violet-800",
    chip: DETAIL_CARD_CHIP,
    section: DETAIL_CARD_SECTION,
    title: DETAIL_CARD_TITLE,
    badge:
      "bg-violet-100 text-violet-800 ring-1 ring-violet-200 dark:bg-violet-900 dark:text-violet-200 dark:ring-violet-800",
  },
  cyan: {
    icon: "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200 dark:bg-cyan-900 dark:text-cyan-300 dark:ring-cyan-800",
    chip: DETAIL_CARD_CHIP,
    section: DETAIL_CARD_SECTION,
    title: DETAIL_CARD_TITLE,
    badge:
      "bg-cyan-100 text-cyan-800 ring-1 ring-cyan-200 dark:bg-cyan-900 dark:text-cyan-200 dark:ring-cyan-800",
  },
  amber: {
    icon: "bg-amber-100 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:ring-amber-800",
    chip: DETAIL_CARD_CHIP,
    section: DETAIL_CARD_SECTION,
    title: DETAIL_CARD_TITLE,
    badge:
      "bg-amber-100 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:ring-amber-800",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:ring-emerald-800",
    chip: DETAIL_CARD_CHIP,
    section: DETAIL_CARD_SECTION,
    title: DETAIL_CARD_TITLE,
    badge:
      "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-900 dark:text-emerald-200 dark:ring-emerald-800",
  },
  teal: {
    icon: "bg-teal-100 text-teal-700 ring-1 ring-teal-200 dark:bg-teal-900 dark:text-teal-300 dark:ring-teal-800",
    chip: DETAIL_CARD_CHIP,
    section: DETAIL_CARD_SECTION,
    title: DETAIL_CARD_TITLE,
    badge:
      "bg-teal-100 text-teal-800 ring-1 ring-teal-200 dark:bg-teal-900 dark:text-teal-200 dark:ring-teal-800",
  },
  rose: {
    icon: "bg-rose-100 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900 dark:text-rose-300 dark:ring-rose-800",
    chip: DETAIL_CARD_CHIP,
    section: DETAIL_CARD_SECTION,
    title: DETAIL_CARD_TITLE,
    badge:
      "bg-rose-100 text-rose-800 ring-1 ring-rose-200 dark:bg-rose-900 dark:text-rose-200 dark:ring-rose-800",
  },
  orange: {
    icon: "bg-orange-100 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:ring-orange-800",
    chip: DETAIL_CARD_CHIP,
    section: DETAIL_CARD_SECTION,
    title: DETAIL_CARD_TITLE,
    badge:
      "bg-orange-100 text-orange-800 ring-1 ring-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:ring-orange-800",
  },
  blue: {
    icon: "bg-blue-100 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:ring-blue-800",
    chip: DETAIL_CARD_CHIP,
    section: DETAIL_CARD_SECTION,
    title: DETAIL_CARD_TITLE,
    badge:
      "bg-blue-100 text-blue-800 ring-1 ring-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:ring-blue-800",
  },
  indigo: {
    icon: "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:ring-indigo-800",
    chip: DETAIL_CARD_CHIP,
    section: DETAIL_CARD_SECTION,
    title: DETAIL_CARD_TITLE,
    badge:
      "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:ring-indigo-800",
  },
};

export const SCHEDULE_TYPE_THEME: Record<
  ScheduleType,
  {
    badge: string;
    headerBg: string;
    icon: string;
    label: string;
    tone: DetailTone;
  }
> = {
  sosmed_content: {
    label: "Sosmed",
    tone: "violet",
    headerBg: "",
    badge: DETAIL_TONE.violet.badge,
    icon: DETAIL_TONE.violet.icon,
  },
  creative_request: {
    label: "Creative",
    tone: "indigo",
    headerBg: "",
    badge: DETAIL_TONE.indigo.badge,
    icon: DETAIL_TONE.indigo.icon,
  },
  custom_schedule: {
    label: "Custom",
    tone: "sky",
    headerBg: "",
    badge: DETAIL_TONE.sky.badge,
    icon: DETAIL_TONE.sky.icon,
  },
  meeting_room: {
    label: "Meeting",
    tone: "teal",
    headerBg: "",
    badge: DETAIL_TONE.teal.badge,
    icon: DETAIL_TONE.teal.icon,
  },
};

export const STATUS_STEP_THEME: Record<
  ScheduleStatus,
  {
    badge: string;
    dot: string;
    label: string;
    ring: string;
    text: string;
    tone: DetailTone;
  }
> = {
  todo: {
    label: "Todo",
    tone: "neutral",
    dot: "bg-muted-foreground/35",
    ring: "ring-muted-foreground/20",
    text: "text-muted-foreground",
    badge: DETAIL_TONE.neutral.badge,
  },
  in_progress: {
    label: "On Process",
    tone: "blue",
    dot: "bg-blue-500",
    ring: "ring-blue-500/25",
    text: "text-foreground",
    badge: DETAIL_TONE.blue.badge,
  },
  ready_for_review: {
    label: "Siap Di Review",
    tone: "cyan",
    dot: "bg-cyan-500",
    ring: "ring-cyan-500/25",
    text: "text-foreground",
    badge: DETAIL_TONE.cyan.badge,
  },
  ready_to_publish: {
    label: "Ready to Publish",
    tone: "amber",
    dot: "bg-amber-500",
    ring: "ring-amber-500/25",
    text: "text-foreground",
    badge: DETAIL_TONE.amber.badge,
  },
  published: {
    label: "Published",
    tone: "violet",
    dot: "bg-violet-500",
    ring: "ring-violet-500/25",
    text: "text-foreground",
    badge: DETAIL_TONE.violet.badge,
  },
  done: {
    label: "Done",
    tone: "emerald",
    dot: "bg-emerald-500",
    ring: "ring-emerald-500/25",
    text: "text-muted-foreground",
    badge: DETAIL_TONE.emerald.badge,
  },
  complete: {
    label: "Complete",
    tone: "emerald",
    dot: "bg-emerald-600 dark:bg-emerald-400",
    ring: "ring-emerald-500/20",
    text: "text-muted-foreground",
    badge: DETAIL_TONE.emerald.badge,
  },
};

/** @deprecated Prefer DETAIL_TONE — kept for older call sites. */
export const DETAIL_ACCENT_THEME: Record<
  DetailAccent,
  {
    chip: string;
    chipIcon: string;
    section: string;
    sectionTitle: string;
  }
> = {
  default: {
    chip: DETAIL_TONE.neutral.chip,
    chipIcon: DETAIL_TONE.neutral.icon,
    section: DETAIL_TONE.neutral.section,
    sectionTitle: DETAIL_TONE.neutral.title,
  },
  subtle: {
    chip: DETAIL_TONE.neutral.chip,
    chipIcon: DETAIL_TONE.neutral.icon,
    section: DETAIL_TONE.neutral.section,
    sectionTitle: DETAIL_TONE.neutral.title,
  },
};

export const PRIORITY_THEME: Record<
  SchedulePriority,
  {
    badge: string;
    icon: string;
    label: string;
    tone: DetailTone;
  }
> = {
  low: {
    label: "Low",
    tone: "neutral",
    badge:
      "bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    icon: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
  medium: {
    label: "Medium",
    tone: "sky",
    badge: DETAIL_TONE.sky.badge,
    icon: DETAIL_TONE.sky.icon,
  },
  high: {
    label: "High",
    tone: "amber",
    badge: DETAIL_TONE.amber.badge,
    icon: DETAIL_TONE.amber.icon,
  },
  urgent: {
    label: "Urgent",
    tone: "rose",
    badge: DETAIL_TONE.rose.badge,
    icon: DETAIL_TONE.rose.icon,
  },
};

export const DETAIL_SURFACE = {
  item: "rounded-xl border border-border bg-card px-3 py-2.5",
  itemIcon: "flex size-8 shrink-0 items-center justify-center rounded-lg",
  link: "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted",
  pill: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5",
  metaRow:
    "flex items-start gap-3 rounded-xl border border-border bg-card px-3 py-3",
};

/** Same gradient language as dashboard shortcut tiles. */
function actionSurface(from: string, to: string, glowRgb: string) {
  return [
    "border-0 bg-linear-to-br text-white",
    "hover:brightness-105 hover:text-white",
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),2px_4px_12px_-2px_rgb(" +
      glowRgb +
      "/0.22)]",
    from,
    to,
  ].join(" ");
}

export const DETAIL_ACTION_SURFACE = {
  rollback: actionSurface("from-[#FFB340]", "to-[#FF9500]", "255_149_0"),
  archive: actionSurface("from-[#C77DFF]", "to-[#AF52DE]", "175_82_222"),
  restore: actionSurface("from-[#64E286]", "to-[#30D158]", "48_209_88"),
  delete: actionSurface("from-[#FF5A7A]", "to-[#FF2D55]", "255_45_85"),
  edit: actionSurface("from-[#64D2FF]", "to-[#007AFF]", "0_122_255"),
} as const;
