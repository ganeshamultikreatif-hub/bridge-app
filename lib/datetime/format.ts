export const APP_LOCALE = "id-ID";
export const APP_TIMEZONE = "Asia/Jakarta";

type DateInput = Date | string | number;

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatAppDate(
  value: DateInput,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(APP_LOCALE, {
    timeZone: APP_TIMEZONE,
    ...options,
  }).format(toDate(value));
}

export function formatAppDateMedium(value: DateInput): string {
  return formatAppDate(value, { dateStyle: "medium" });
}

export function formatAppDateLong(value: DateInput): string {
  return formatAppDate(value, { dateStyle: "long" });
}

export function formatAppDateTime(value: DateInput): string {
  return formatAppDate(value, { dateStyle: "medium", timeStyle: "short" });
}

export function formatAppMonthYear(value: DateInput): string {
  return formatAppDate(value, { month: "long", year: "numeric" });
}

export function formatAppWeekdayDate(value: DateInput): string {
  return formatAppDate(value, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getAppDateParts(date = new Date()): {
  day: number;
  month: number;
  year: number;
} {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: APP_TIMEZONE,
    year: "numeric",
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    day: read("day"),
    month: read("month"),
    year: read("year"),
  };
}

/** Calendar "today" in app timezone — stable between server (UTC) and client (local). */
export function getAppToday(): Date {
  const { day, month, year } = getAppDateParts();
  return new Date(year, month - 1, day);
}
