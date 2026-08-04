import {
  ALL_SCHEDULE_STATUSES,
  getScheduleStatusFlow,
  getScheduleStatusLabel,
  SCHEDULE_STATUS_LABELS,
} from "@/lib/scheduler/schedule-workflow";
import type { ScheduleStatus, ScheduleType } from "@/types/schedule";

export {
  getAdvanceActionLabel,
  getNextScheduleStatus,
  getRollbackStatusOptions,
  getScheduleStatusFlow,
  getScheduleStatusLabel,
  isFinishedScheduleStatus,
  isTerminalScheduleStatus,
  isValidRollbackTarget,
  requiresDeliverableForAdvance,
  scheduleNeedsReview,
} from "@/lib/scheduler/schedule-workflow";

export const SCHEDULE_STATUS_OPTIONS = ALL_SCHEDULE_STATUSES.map((value) => ({
  value,
  label: SCHEDULE_STATUS_LABELS[value],
}));

export function getScheduleStatusOptions(
  scheduleType?: ScheduleType,
): { label: string; value: ScheduleStatus }[] {
  return getScheduleStatusFlow(scheduleType).map((value) => ({
    value,
    label: getScheduleStatusLabel(value, scheduleType),
  }));
}
