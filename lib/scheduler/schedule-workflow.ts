import type { ScheduleStatus, ScheduleType } from "@/types/schedule";

export const SOSMED_STATUS_FLOW = [
  "todo",
  "in_progress",
  "ready_to_publish",
  "published",
  "done",
] as const satisfies readonly ScheduleStatus[];

export const SOSMED_REVIEW_STATUS_FLOW = [
  "todo",
  "in_progress",
  "ready_for_review",
  "ready_to_publish",
  "published",
  "done",
] as const satisfies readonly ScheduleStatus[];

export const DEFAULT_STATUS_FLOW = [
  "todo",
  "in_progress",
  "complete",
] as const satisfies readonly ScheduleStatus[];

export const DEFAULT_REVIEW_STATUS_FLOW = [
  "todo",
  "in_progress",
  "ready_for_review",
  "complete",
] as const satisfies readonly ScheduleStatus[];

export const ALL_SCHEDULE_STATUSES = [
  "todo",
  "in_progress",
  "ready_for_review",
  "ready_to_publish",
  "published",
  "done",
  "complete",
] as const satisfies readonly ScheduleStatus[];

export const SCHEDULE_STATUS_LABELS: Record<ScheduleStatus, string> = {
  todo: "Todo",
  in_progress: "On Process",
  ready_for_review: "Siap Di Review",
  ready_to_publish: "Ready to Publish",
  published: "Published",
  done: "Done",
  complete: "Complete",
};

export function scheduleNeedsReview(reviewers?: string): boolean {
  return Boolean(reviewers?.trim());
}

export function getScheduleStatusFlow(
  scheduleType?: ScheduleType,
  needsReview = false,
): readonly ScheduleStatus[] {
  // Meeting rooms always use a short confirm flow — no review gate.
  if (scheduleType === "meeting_room") {
    return DEFAULT_STATUS_FLOW;
  }

  if (scheduleType === "sosmed_content") {
    return needsReview ? SOSMED_REVIEW_STATUS_FLOW : SOSMED_STATUS_FLOW;
  }

  return needsReview ? DEFAULT_REVIEW_STATUS_FLOW : DEFAULT_STATUS_FLOW;
}

export function getScheduleStatusLabel(
  status: ScheduleStatus,
  scheduleType?: ScheduleType,
): string {
  if (scheduleType === "meeting_room") {
    if (status === "in_progress") {
      return "Ruangan sedang digunakan";
    }

    if (status === "complete" || status === "done") {
      return "Selesai";
    }
  }

  if (scheduleType === "sosmed_content" && status === "in_progress") {
    return "On Process";
  }

  return SCHEDULE_STATUS_LABELS[status] ?? status;
}

export function getNextScheduleStatus(
  current: ScheduleStatus,
  scheduleType?: ScheduleType,
  needsReview = false,
): ScheduleStatus | null {
  const flow = getScheduleStatusFlow(scheduleType, needsReview);
  const index = flow.indexOf(current);

  if (index < 0 || index >= flow.length - 1) {
    return null;
  }

  return flow[index + 1] ?? null;
}

export function getRollbackStatusOptions(
  current: ScheduleStatus,
  scheduleType?: ScheduleType,
  needsReview = false,
): ScheduleStatus[] {
  const flow = getScheduleStatusFlow(scheduleType, needsReview);
  const currentIndex = flow.indexOf(current);

  if (currentIndex <= 0) {
    return [];
  }

  return flow.slice(0, currentIndex) as ScheduleStatus[];
}

export function isValidRollbackTarget(
  current: ScheduleStatus,
  target: ScheduleStatus,
  scheduleType?: ScheduleType,
  needsReview = false,
): boolean {
  return getRollbackStatusOptions(current, scheduleType, needsReview).includes(
    target,
  );
}

export function getAdvanceActionLabel(
  current: ScheduleStatus,
  scheduleType?: ScheduleType,
  needsReview = false,
): string | null {
  const next = getNextScheduleStatus(current, scheduleType, needsReview);

  if (!next) {
    return null;
  }

  if (next === "ready_for_review") {
    return "Tandai Siap Di Review";
  }

  return `Lanjut ke ${getScheduleStatusLabel(next, scheduleType)}`;
}

export function isTerminalScheduleStatus(
  status: ScheduleStatus,
  scheduleType?: ScheduleType,
  needsReview = false,
): boolean {
  const flow = getScheduleStatusFlow(scheduleType, needsReview);
  return status === flow[flow.length - 1];
}

export function isFinishedScheduleStatus(status: ScheduleStatus): boolean {
  return status === "complete" || status === "done";
}

export function canUploadDeliverable(
  status: ScheduleStatus,
  scheduleType?: ScheduleType,
): boolean {
  if (status === "ready_for_review") {
    return false;
  }

  if (scheduleType === "sosmed_content") {
    return status === "in_progress" || status === "ready_to_publish";
  }

  return status === "in_progress";
}

/** Bahan edit boleh diunggah selama jadwal belum selesai. */
export function canUploadEditMaterial(status: ScheduleStatus): boolean {
  return !isFinishedScheduleStatus(status);
}

export function isActiveScheduleStatus(status: ScheduleStatus): boolean {
  return (
    status === "in_progress" ||
    status === "ready_for_review" ||
    status === "ready_to_publish" ||
    status === "published"
  );
}

export function requiresDeliverableForAdvance(
  current: ScheduleStatus,
  scheduleType?: ScheduleType,
  needsReview = false,
): boolean {
  if (scheduleType === "meeting_room") {
    return false;
  }

  const next = getNextScheduleStatus(current, scheduleType, needsReview);
  return next === "ready_for_review";
}

export function createEmptyStatusBreakdown(): Record<ScheduleStatus, number> {
  return {
    todo: 0,
    in_progress: 0,
    ready_for_review: 0,
    ready_to_publish: 0,
    published: 0,
    done: 0,
    complete: 0,
  };
}

/** Dashboard aggregates sosmed mid-flow into active bucket. */
export function getDashboardStatusGroups(): {
  key: "todo" | "active" | "done";
  label: string;
  statuses: ScheduleStatus[];
}[] {
  return [
    { key: "todo", label: "Todo", statuses: ["todo"] },
    {
      key: "active",
      label: "On Process",
      statuses: [
        "in_progress",
        "ready_for_review",
        "ready_to_publish",
        "published",
      ],
    },
    {
      key: "done",
      label: "Selesai",
      statuses: ["complete", "done"],
    },
  ];
}

export function aggregateStatusBreakdown(
  breakdown: Record<ScheduleStatus, number>,
): { active: number; done: number; todo: number } {
  const [todoGroup, activeGroup, doneGroup] = getDashboardStatusGroups();
  const todo =
    todoGroup?.statuses.reduce((sum, status) => sum + breakdown[status], 0) ??
    0;
  const active =
    activeGroup?.statuses.reduce((sum, status) => sum + breakdown[status], 0) ??
    0;
  const done =
    doneGroup?.statuses.reduce((sum, status) => sum + breakdown[status], 0) ??
    0;

  return { active, done, todo };
}
