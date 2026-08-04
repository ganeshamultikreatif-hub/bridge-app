import { parseScheduleDateTime } from "@/lib/calendar/date-utils";
import { getPayloadString } from "@/lib/scheduler/schedule-payload";
import { isFinishedScheduleStatus } from "@/lib/scheduler/schedule-workflow";
import type { ScheduleItem } from "@/types/schedule";

export type MeetingRoomLifecyclePhase =
  | "upcoming"
  | "awaiting_room_use"
  | "in_use"
  | "awaiting_completion"
  | "finished";

export function isMeetingRoomSchedule(item: ScheduleItem): boolean {
  return item.scheduleType === "meeting_room";
}

export function getMeetingRoomStartDateTime(item: ScheduleItem): Date {
  const startTime =
    getPayloadString(item, "meetingStartTime")?.trim() || item.time;

  return parseScheduleDateTime(item.date, startTime);
}

export function getMeetingRoomEndDateTime(item: ScheduleItem): Date {
  const endTime = getPayloadString(item, "meetingEndTime")?.trim();

  if (endTime) {
    return parseScheduleDateTime(item.endDate ?? item.date, endTime);
  }

  // Fallback: treat start as end if end time missing.
  return getMeetingRoomStartDateTime(item);
}

export function getMeetingRoomLifecyclePhase(
  item: ScheduleItem,
  nowMs: number = Date.now(),
): MeetingRoomLifecyclePhase | null {
  if (!isMeetingRoomSchedule(item) || item.archivedAt) {
    return null;
  }

  if (isFinishedScheduleStatus(item.status)) {
    return "finished";
  }

  const startMs = getMeetingRoomStartDateTime(item).getTime();
  const endMs = getMeetingRoomEndDateTime(item).getTime();

  if (item.status === "todo") {
    return nowMs >= startMs ? "awaiting_room_use" : "upcoming";
  }

  if (item.status === "in_progress") {
    return nowMs >= endMs ? "awaiting_completion" : "in_use";
  }

  // Reviewer edge-cases — treat like in-use until finished.
  return nowMs >= endMs ? "awaiting_completion" : "in_use";
}

/** Yellow attention states that replace “Terlambat” for meeting rooms. */
export function isMeetingRoomAttentionPhase(
  item: ScheduleItem,
  nowMs: number = Date.now(),
): boolean {
  const phase = getMeetingRoomLifecyclePhase(item, nowMs);
  return phase === "awaiting_room_use" || phase === "awaiting_completion";
}

export function getMeetingRoomDisplayLabel(
  item: ScheduleItem,
  nowMs: number = Date.now(),
): string | null {
  const phase = getMeetingRoomLifecyclePhase(item, nowMs);

  switch (phase) {
    case "awaiting_room_use":
      return "Apakah Ruangan sudah digunakan?";
    case "in_use":
      return "Ruangan sedang digunakan";
    case "awaiting_completion":
      return "Apakah meeting sudah selesai?";
    default:
      return null;
  }
}

export function getMeetingRoomPromptCopy(
  item: ScheduleItem,
  nowMs: number = Date.now(),
): {
  confirmLabel: string;
  description: string;
  nextStatus: "in_progress" | "complete";
  title: string;
} | null {
  const phase = getMeetingRoomLifecyclePhase(item, nowMs);

  if (phase === "awaiting_room_use") {
    return {
      title: "Apakah Ruangan sudah digunakan?",
      description:
        "Konfirmasi jika ruangan sudah mulai dipakai untuk meeting ini.",
      confirmLabel: "Ya, sudah digunakan",
      nextStatus: "in_progress",
    };
  }

  if (phase === "awaiting_completion") {
    return {
      title: "Apakah meeting sudah selesai?",
      description:
        "Konfirmasi jika meeting sudah berakhir. Jadwal akan ditandai Complete.",
      confirmLabel: "Ya, sudah selesai",
      nextStatus: "complete",
    };
  }

  return null;
}
