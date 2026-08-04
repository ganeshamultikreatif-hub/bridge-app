import type { LeadStatus } from "@/types/lead";

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "meeting",
  "quotation",
  "won",
  "lost",
];

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  meeting: "Meeting",
  quotation: "Quotation",
  won: "Won",
  lost: "Lost",
};

export const LEAD_STATUS_DESCRIPTION: Record<LeadStatus, string> = {
  new: "Belum di-follow-up",
  contacted: "Sudah dihubungi",
  qualified: "Potensi jelas",
  meeting: "Demo / discovery booked",
  quotation: "Proposal dikirim",
  won: "Deal closed",
  lost: "Tidak lanjut",
};

export const LEAD_STATUS_CLASS: Record<LeadStatus, string> = {
  new: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
  contacted: "bg-amber-500/15 text-amber-900 dark:text-amber-300",
  qualified: "bg-violet-500/15 text-violet-800 dark:text-violet-300",
  meeting: "bg-indigo-500/15 text-indigo-800 dark:text-indigo-300",
  quotation: "bg-orange-500/15 text-orange-900 dark:text-orange-300",
  won: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
  lost: "bg-muted text-muted-foreground",
};

export const LEAD_DISTRIBUTION_MODES = [
  {
    id: "manual" as const,
    label: "Manual",
    description: "Drag lead ke kolom status / sales owner sendiri.",
  },
  {
    id: "round-robin" as const,
    label: "Round robin",
    description: "Lead baru bergilir ke sales berikutnya secara otomatis.",
  },
  {
    id: "department" as const,
    label: "Department",
    description: "Lead masuk pool divisi, lalu di-assign sales di dalamnya.",
  },
];
