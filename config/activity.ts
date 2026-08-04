import type { ActivityAction, ActivityEntityType } from "@/types/activity";

export const ACTIVITY_PAGE_SIZE = 20;

export const ACTIVITY_ENTITY_LABELS: Record<ActivityEntityType, string> = {
  attachment: "File",
  kpi_period: "KPI",
  media: "Media",
  schedule: "Jadwal",
  user: "Pengguna",
};

export const ACTIVITY_ACTION_BADGES: Record<
  ActivityAction,
  { label: string; className: string }
> = {
  "schedule.created": {
    label: "Jadwal baru",
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  },
  "schedule.updated": {
    label: "Diperbarui",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  "schedule.status_changed": {
    label: "Status",
    className:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  },
  "schedule.completed": {
    label: "Selesai",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  "schedule.deleted": {
    label: "Dihapus",
    className: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  },
  "schedule.archived": {
    label: "Diarsipkan",
    className: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  },
  "schedule.restored": {
    label: "Dipulihkan",
    className: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  },
  "attachment.uploaded": {
    label: "Upload file",
    className:
      "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  },
  "attachment.deleted": {
    label: "Hapus file",
    className: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  },
  "media.deleted": {
    label: "Hapus media",
    className: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  },
  "user.created": {
    label: "Pengguna baru",
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  },
  "user.updated": {
    label: "Profil diperbarui",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  "user.deleted": {
    label: "Pengguna dihapus",
    className: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  },
  "kpi.targets_updated": {
    label: "Target KPI",
    className:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
  },
};
