import { getMeetingRoomTypeLabel } from "@/config/meeting-room";
import { STATUS_STEP_THEME } from "@/config/schedule-detail-theme";
import { isOverdueSchedule } from "@/lib/calendar/schedule-utils";
import { getScheduleBrandValue } from "@/lib/scheduler/brand-filter";
import {
  getMeetingRoomDisplayLabel,
  isMeetingRoomAttentionPhase,
} from "@/lib/scheduler/meeting-room-lifecycle";
import {
  formatScheduleDateRangeLabel,
  formatScheduleTimeLabel,
  getCreativeRequestTypeLabels,
  getPayloadString,
  getPayloadStringArray,
  getScheduleContentTypeLabel,
  getScheduleTypeLabel,
  getSocialPlatformLabels,
} from "@/lib/scheduler/schedule-detail-presenter";
import { getScheduleStatusLabel } from "@/lib/scheduler/schedule-status";
import type {
  ScheduleItem,
  ScheduleStatus,
  ScheduleType,
} from "@/types/schedule";

export type SocialPlatformId =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "tiktok"
  | "x"
  | "youtube";

const SOCIAL_PLATFORM_IDS = new Set<string>([
  "facebook",
  "instagram",
  "linkedin",
  "tiktok",
  "x",
  "youtube",
]);

/** Icon / glyph color by workflow status — matches STATUS_STEP_THEME dots. */
export const SCHEDULE_STATUS_ICON_CLASSES: Record<ScheduleStatus, string> = {
  todo: "text-muted-foreground",
  in_progress: "text-blue-500 dark:text-blue-400",
  ready_for_review: "text-cyan-500 dark:text-cyan-400",
  ready_to_publish: "text-amber-500 dark:text-amber-400",
  published: "text-violet-500 dark:text-violet-400",
  done: "text-emerald-500 dark:text-emerald-400",
  complete: "text-emerald-600 dark:text-emerald-400",
};

/** Left stripe by schedule type — matches SCHEDULE_TYPE_THEME tones. */
export const SCHEDULE_TYPE_STRIPE_CLASSES: Record<ScheduleType, string> = {
  sosmed_content: "bg-violet-500 dark:bg-violet-400",
  creative_request: "bg-indigo-500 dark:bg-indigo-400",
  custom_schedule: "bg-sky-500 dark:bg-sky-400",
  meeting_room: "bg-teal-500 dark:bg-teal-400",
};

export interface ScheduleTilePerson {
  initials: string;
  username: string;
}

export interface ScheduleTileViewModel {
  /** People assigned to do the work (`assignment`). */
  assignees: ScheduleTilePerson[];
  brandSlug?: string | undefined;
  contentTypeLabel?: string | undefined;
  countsTowardKpi: boolean;
  creativeTypeLabel?: string | undefined;
  dateLabel: string;
  meetingRoomLabel?: string | undefined;
  meetingRoomUserName?: string | undefined;
  /** Meeting room awaiting room-use / completion confirmation (yellow). */
  meetingAttention: boolean;
  overdue: boolean;
  /** Schedule creator (`createdBy`). */
  owner?: ScheduleTilePerson | undefined;
  platforms: string[];
  platformLabels: string[];
  primaryPlatform?: SocialPlatformId | undefined;
  /** People who review (`reviewers`). */
  reviewers: ScheduleTilePerson[];
  scheduleType?: ScheduleType | undefined;
  scheduleTypeLabel: string;
  statusDotClass: string;
  statusIconClass: string;
  statusLabel: string;
  stripeClass: string;
  subtitle: string;
  time: string;
  timeLabel: string;
  title: string;
}

/** @deprecated Use ScheduleTilePerson */
export type ScheduleTileAssignee = ScheduleTilePerson;

function parsePeople(value: string | undefined): ScheduleTilePerson[] {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((username) => ({
      username,
      initials: username.slice(0, 2).toUpperCase(),
    }));
}

function parsePrimaryPlatform(values: string[]): SocialPlatformId | undefined {
  const match = values.find((value) => SOCIAL_PLATFORM_IDS.has(value));
  return match as SocialPlatformId | undefined;
}

export function getScheduleTileViewModel(
  item: ScheduleItem,
): ScheduleTileViewModel {
  const overdue = isOverdueSchedule(item);
  const meetingAttention = isMeetingRoomAttentionPhase(item);
  const meetingDisplayLabel = getMeetingRoomDisplayLabel(item);
  const platforms = getPayloadStringArray(item, "postOn");
  const assignees = parsePeople(item.assignment);
  const reviewers = parsePeople(item.reviewers);
  const owner = item.createdBy?.trim()
    ? {
        username: item.createdBy.trim(),
        initials: item.createdBy.trim().slice(0, 2).toUpperCase(),
      }
    : undefined;
  const scheduleType = item.scheduleType;
  const brandSlug = getScheduleBrandValue(item);
  const title = item.title.trim() || item.category;
  const subtitle =
    item.title.trim() && item.category !== item.title
      ? item.category
      : scheduleType
        ? getScheduleTypeLabel(scheduleType)
        : item.category;
  const meetingStart = getPayloadString(item, "meetingStartTime");
  const meetingEnd = getPayloadString(item, "meetingEndTime");
  const meetingRoomType = getPayloadString(item, "meetingRoomType");
  const meetingRoomUserName = getPayloadString(item, "meetingRoomUserName");
  const timeLabel =
    scheduleType === "meeting_room" && meetingStart && meetingEnd
      ? `${meetingStart}–${meetingEnd} WIB`
      : formatScheduleTimeLabel(item.time);
  const contentTypeLabel =
    getScheduleContentTypeLabel(
      scheduleType,
      getPayloadString(item, "contentType"),
    ) ?? undefined;
  const creativeLabels = getCreativeRequestTypeLabels(
    getPayloadStringArray(item, "requestTypes"),
  );
  const creativeTypeLabel =
    creativeLabels.length > 0 ? creativeLabels.join(", ") : undefined;
  const meetingRoomLabel =
    getMeetingRoomTypeLabel(meetingRoomType) ?? undefined;

  const statusLabel = overdue
    ? "Terlambat"
    : (meetingDisplayLabel ??
      getScheduleStatusLabel(item.status, scheduleType));

  return {
    assignees,
    brandSlug,
    contentTypeLabel,
    countsTowardKpi: Boolean(item.countsTowardKpi),
    creativeTypeLabel,
    dateLabel: formatScheduleDateRangeLabel(item.date, item.endDate),
    meetingAttention,
    meetingRoomLabel,
    meetingRoomUserName: meetingRoomUserName?.trim() || undefined,
    overdue,
    owner,
    platforms,
    platformLabels: getSocialPlatformLabels(platforms),
    primaryPlatform: parsePrimaryPlatform(platforms),
    reviewers,
    scheduleType,
    scheduleTypeLabel: getScheduleTypeLabel(scheduleType),
    statusDotClass: overdue
      ? "bg-red-500 dark:bg-red-400"
      : meetingAttention
        ? "bg-amber-500 dark:bg-amber-400"
        : STATUS_STEP_THEME[item.status].dot,
    statusIconClass: overdue
      ? "text-red-500 dark:text-red-400"
      : meetingAttention
        ? "text-amber-600 dark:text-amber-400"
        : SCHEDULE_STATUS_ICON_CLASSES[item.status],
    statusLabel,
    stripeClass: overdue
      ? "bg-red-400 dark:bg-red-500"
      : meetingAttention
        ? "bg-amber-400 dark:bg-amber-500"
        : scheduleType
          ? SCHEDULE_TYPE_STRIPE_CLASSES[scheduleType]
          : "bg-muted-foreground/40",
    subtitle,
    time: item.time,
    timeLabel,
    title,
  };
}
