import { UPCOMING_SOON_WINDOW_MS } from "@/config/calendar.constants";
import {
  getDateKey,
  parseScheduleDate,
  parseScheduleDateTime,
} from "@/lib/calendar/date-utils";
import {
  createEmptyStatusBreakdown,
  isFinishedScheduleStatus,
} from "@/lib/scheduler/schedule-workflow";
import type { ScheduleItem } from "@/types/schedule";

export function isScheduleCompleted(item: ScheduleItem): boolean {
  return isFinishedScheduleStatus(item.status);
}

export function isSchedulePosted(item: ScheduleItem): boolean {
  return isScheduleCompleted(item) || item.status === "published";
}

export function isOverdueSchedule(item: ScheduleItem): boolean {
  if (item.archivedAt) {
    return false;
  }

  // Meeting rooms use a confirmation flow instead of “Terlambat”.
  if (item.scheduleType === "meeting_room") {
    return false;
  }

  if (isSchedulePosted(item)) {
    return false;
  }

  return getPublishDateTime(item).getTime() < Date.now();
}

export function getScheduleOverdueMinutes(item: ScheduleItem): number | null {
  if (!isOverdueSchedule(item)) {
    return null;
  }

  const diffInMs = Date.now() - getPublishDateTime(item).getTime();

  return Math.max(1, Math.round(diffInMs / (60 * 1000)));
}

export function getPublishDateTime(item: ScheduleItem): Date {
  const deadlineDate = item.endDate ?? item.date;
  return parseScheduleDateTime(deadlineDate, item.time);
}

export function getPublishSoonMinutesRemaining(
  item: ScheduleItem,
): number | null {
  if (!isUpcomingSoon(item)) {
    return null;
  }

  const diffInMs = getPublishDateTime(item).getTime() - Date.now();
  return Math.max(1, Math.ceil(diffInMs / (60 * 1000)));
}

export function isUpcomingSoon(item: ScheduleItem): boolean {
  if (item.scheduleType !== "sosmed_content") {
    return false;
  }

  if (isScheduleCompleted(item) || item.status === "published") {
    return false;
  }

  const diffInMs = getPublishDateTime(item).getTime() - Date.now();
  return diffInMs > 0 && diffInMs <= UPCOMING_SOON_WINDOW_MS;
}

export function hasUpcomingSoonSchedule(items: ScheduleItem[]): boolean {
  return items.some(isUpcomingSoon);
}

export function sortSchedulesByDateTime(items: ScheduleItem[]): ScheduleItem[] {
  return [...items].sort(
    (a, b) =>
      parseScheduleDateTime(a.date, a.time).getTime() -
      parseScheduleDateTime(b.date, b.time).getTime(),
  );
}

export function groupSchedulesByDate(
  items: ScheduleItem[],
): Record<string, ScheduleItem[]> {
  return items.reduce<Record<string, ScheduleItem[]>>((accumulator, item) => {
    const start = parseScheduleDate(item.date);
    const end = parseScheduleDate(item.endDate ?? item.date);
    const cursor = new Date(start);

    while (cursor.getTime() <= end.getTime()) {
      const key = getDateKey(cursor);
      accumulator[key] = [...(accumulator[key] ?? []), item];
      cursor.setDate(cursor.getDate() + 1);
    }

    return accumulator;
  }, {});
}

export function filterSchedulesByMonth(
  items: ScheduleItem[],
  activeMonth: Date,
): ScheduleItem[] {
  const month = activeMonth.getMonth();
  const year = activeMonth.getFullYear();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  return items.filter((item) => {
    const start = parseScheduleDate(item.date);
    const end = parseScheduleDate(item.endDate ?? item.date);

    return (
      start.getTime() <= monthEnd.getTime() &&
      end.getTime() >= monthStart.getTime()
    );
  });
}

export type ProgressStats = {
  completed: number;
  percentage: number;
  total: number;
};

export function getProgressStats(items: ScheduleItem[]): ProgressStats {
  const total = items.length;
  const completed = items.filter(isScheduleCompleted).length;

  return {
    completed,
    percentage: total ? Math.round((completed / total) * 100) : 0,
    total,
  };
}

export function getStatusBreakdown(items: ScheduleItem[]) {
  const breakdown = createEmptyStatusBreakdown();

  for (const item of items) {
    if (item.status in breakdown) {
      breakdown[item.status] += 1;
    }
  }

  return breakdown;
}

export function isTodoSchedule(item: ScheduleItem): boolean {
  return item.status === "todo";
}

export function getLatestNewScheduleId(items: ScheduleItem[]): string | null {
  return (
    items
      .filter((item) => item.createdAt && isTodoSchedule(item))
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? "").getTime() -
          new Date(a.createdAt ?? "").getTime(),
      )[0]?.id ?? null
  );
}
