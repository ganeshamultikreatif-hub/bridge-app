import {
  CONTENT_PILLAR_OPTIONS,
  CREATIVE_REQUEST_TYPE_OPTIONS,
  SCHEDULE_PRIORITY_OPTIONS,
  SCHEDULE_TYPE_OPTIONS,
  SOCIAL_PLATFORM_OPTIONS,
  SOSMED_CONTENT_TYPE_OPTIONS,
} from "@/config/schedule-form.constants";
import { parseScheduleDate } from "@/lib/calendar/date-utils";
import { formatAppDate, formatAppWeekdayDate } from "@/lib/datetime/format";
import {
  getCompletedAt,
  getCompletionFiles,
  getEditMaterialFiles,
  getPayloadString,
  getPayloadStringArray,
  getReferenceFiles,
} from "@/lib/scheduler/schedule-payload";
import type { SchedulePriority, ScheduleType } from "@/types/schedule";

export {
  getCompletedAt,
  getCompletionFiles,
  getEditMaterialFiles,
  getPayloadString,
  getPayloadStringArray,
  getReferenceFiles,
};

function findLabel(
  options: readonly { label: string; value: string }[],
  value: string | undefined,
): string | null {
  if (!value) {
    return null;
  }

  return options.find((option) => option.value === value)?.label ?? value;
}

export function getScheduleTypeLabel(type: ScheduleType | undefined): string {
  if (!type) {
    return "Jadwal";
  }

  return (
    SCHEDULE_TYPE_OPTIONS.find((option) => option.value === type)?.label ??
    "Jadwal"
  );
}

export function getPriorityLabel(
  priority: SchedulePriority | undefined,
): string {
  if (!priority) {
    return "—";
  }

  return (
    SCHEDULE_PRIORITY_OPTIONS.find((option) => option.value === priority)
      ?.label ?? priority
  );
}

export function formatScheduleDateLabel(date: string): string {
  const parsed = parseScheduleDate(date);

  return formatAppWeekdayDate(parsed);
}

export function formatScheduleDateRangeLabel(
  date: string,
  endDate?: string | null,
): string {
  const end = endDate && endDate !== date ? endDate : null;

  if (!end) {
    return formatScheduleDateLabel(date);
  }

  const from = parseScheduleDate(date);
  const to = parseScheduleDate(end);
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

export function formatScheduleTimeLabel(time: string): string {
  return `${time} WIB`;
}

export function getContentTypeLabel(value: string | undefined): string | null {
  return findLabel(SOSMED_CONTENT_TYPE_OPTIONS, value);
}

export function getScheduleContentTypeLabel(
  scheduleType: ScheduleType | undefined,
  contentType: string | undefined,
): string | null {
  if (scheduleType !== "sosmed_content") {
    return null;
  }

  return getContentTypeLabel(contentType);
}

export function getContentPillarLabel(
  value: string | undefined,
): string | null {
  if (!value) {
    return null;
  }

  const option = CONTENT_PILLAR_OPTIONS.find(
    (pillar) => pillar.value === value,
  );
  return option?.label ?? value;
}

export function getSocialPlatformLabels(
  values: string[] | undefined,
): string[] {
  if (!values?.length) {
    return [];
  }

  return values.map(
    (value) =>
      SOCIAL_PLATFORM_OPTIONS.find((option) => option.value === value)?.label ??
      value,
  );
}

export function getCreativeRequestTypeLabels(
  values: string[] | undefined,
): string[] {
  if (!values?.length) {
    return [];
  }

  return values.map(
    (value) =>
      CREATIVE_REQUEST_TYPE_OPTIONS.find((option) => option.value === value)
        ?.label ?? value,
  );
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hasRichTextContent(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  return stripHtml(value).length > 0;
}
