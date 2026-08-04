import type { DateRange } from "react-day-picker";
import { formatInputDate, parseScheduleDate } from "@/lib/calendar/date-utils";
import { formatAppDate, getAppToday } from "@/lib/datetime/format";

export interface DashboardDateRange {
  from: string;
  to: string;
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return !Number.isNaN(parseScheduleDate(value).getTime());
}

export function getMonthDateRange(
  year: number,
  month: number,
): DashboardDateRange {
  const fromDate = new Date(year, month, 1);
  const toDate = new Date(year, month + 1, 0);

  return {
    from: formatInputDate(fromDate),
    to: formatInputDate(toDate),
  };
}

export function getDefaultDashboardDateRange(): DashboardDateRange {
  const today = getAppToday();

  return getMonthDateRange(today.getFullYear(), today.getMonth());
}

export function parseDashboardDateRange(input: {
  from?: string | undefined;
  to?: string | undefined;
}): DashboardDateRange {
  const { from, to } = input;

  if (
    from &&
    to &&
    isValidIsoDate(from) &&
    isValidIsoDate(to) &&
    parseScheduleDate(from).getTime() <= parseScheduleDate(to).getTime()
  ) {
    return { from, to };
  }

  return getDefaultDashboardDateRange();
}

export function shiftDashboardDateRangeByMonth(
  range: DashboardDateRange,
  delta: number,
): DashboardDateRange {
  const anchor = parseScheduleDate(range.from);

  return getMonthDateRange(anchor.getFullYear(), anchor.getMonth() + delta);
}

export function isCurrentMonthRange(range: DashboardDateRange): boolean {
  const current = getDefaultDashboardDateRange();

  return range.from === current.from && range.to === current.to;
}

export function formatDashboardDateRangeLabel(
  range: DashboardDateRange,
): string {
  const from = parseScheduleDate(range.from);
  const to = parseScheduleDate(range.to);
  const sameMonth =
    from.getFullYear() === to.getFullYear() &&
    from.getMonth() === to.getMonth();

  if (sameMonth) {
    return formatAppDate(from, { month: "long", year: "numeric" });
  }

  const fromLabel = formatAppDate(from, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const toLabel = formatAppDate(to, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${fromLabel} – ${toLabel}`;
}

export function dashboardRangeToDateRange(
  value: DashboardDateRange,
): DateRange {
  return {
    from: parseScheduleDate(value.from),
    to: parseScheduleDate(value.to),
  };
}

export function dateRangeToDashboardRange(
  range: DateRange | undefined,
): DashboardDateRange | null {
  if (!range?.from || !range?.to) {
    return null;
  }

  return {
    from: formatInputDate(range.from),
    to: formatInputDate(range.to),
  };
}
