import { getAppToday } from "@/lib/datetime/format";

export type CalendarDay = {
  date: Date;
  key: string;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export function getDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function parseScheduleDate(value: string): Date {
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function parseScheduleDateTime(date: string, time: string): Date {
  const parsed = parseScheduleDate(date);
  const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);

  if (!timeMatch) {
    return parsed;
  }

  const [, hour, minute] = timeMatch;
  parsed.setHours(Number(hour), Number(minute), 0, 0);
  return parsed;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isPastDate(date: Date): boolean {
  return startOfDay(date).getTime() < startOfDay(getAppToday()).getTime();
}

export function formatInputDate(date: Date): string {
  return getDateKey(date);
}

/** Calendar date (YYYY-MM-DD) → Prisma `@db.Date` (always UTC midnight). */
export function parseDateForDb(isoDate: string): Date {
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);

  if (!isoMatch) {
    throw new Error(`Invalid calendar date: ${isoDate}`);
  }

  const [, year, month, day] = isoMatch;
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

/** Prisma `@db.Date` → calendar date string (YYYY-MM-DD). */
export function formatDbDate(date: Date): string {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

export function getMonthDays(currentDate: Date): CalendarDay[] {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const sundayOffset = firstDay.getDay();
  const gridStart = new Date(year, month, 1 - sundayOffset);
  const totalDays = Math.ceil((sundayOffset + lastDay.getDate()) / 7) * 7;
  const todayKey = getDateKey(getAppToday());

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    return {
      date,
      key: getDateKey(date),
      isCurrentMonth: date.getMonth() === month,
      isToday: getDateKey(date) === todayKey,
    };
  });
}

export function getYearOptions(
  activeMonth: Date,
  itemYears: number[] = [],
): number[] {
  const currentYear = getAppToday().getFullYear();
  const baseYears = Array.from(
    { length: 7 },
    (_, index) => currentYear - 3 + index,
  );

  return Array.from(
    new Set([...baseYears, ...itemYears, activeMonth.getFullYear()]),
  ).sort((a, b) => a - b);
}
