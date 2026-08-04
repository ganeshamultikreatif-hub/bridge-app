import type { BroadcastStatus } from "@/types/broadcast";

export const BROADCAST_STATUS_LABEL: Record<BroadcastStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
};

export const BROADCAST_STATUS_CLASS: Record<BroadcastStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  running: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  completed: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
  failed: "bg-destructive/15 text-destructive",
};

export const BROADCAST_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "running", label: "Running" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
] as const satisfies ReadonlyArray<{
  value: BroadcastStatus;
  label: string;
}>;

export const BROADCAST_WIZARD_STEPS = [
  { id: "department", label: "Department" },
  { id: "audience", label: "Audience" },
  { id: "template", label: "Template" },
  { id: "preview", label: "Preview" },
  { id: "cta", label: "CTA" },
  { id: "schedule", label: "Schedule" },
  { id: "send", label: "Send" },
] as const;

export type BroadcastWizardStepId =
  (typeof BROADCAST_WIZARD_STEPS)[number]["id"];
