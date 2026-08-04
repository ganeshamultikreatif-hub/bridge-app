import type { CompletionFileMeta } from "@/lib/scheduler/file-upload-utils";
import type { ScheduleItem } from "@/types/schedule";

export function getPayloadString(
  item: ScheduleItem,
  key: string,
): string | undefined {
  const value = item.payload?.[key];

  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  return value;
}

export function getPayloadStringArray(
  item: ScheduleItem,
  key: string,
): string[] {
  const value = item.payload?.[key];

  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

export function getReferenceFiles(item: ScheduleItem): CompletionFileMeta[] {
  const value = item.payload?.referenceFiles;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (entry): entry is CompletionFileMeta =>
      typeof entry === "object" &&
      entry !== null &&
      "name" in entry &&
      typeof entry.name === "string" &&
      "size" in entry &&
      typeof entry.size === "number",
  );
}

export function getCompletionFiles(item: ScheduleItem): CompletionFileMeta[] {
  const value = item.payload?.completionFiles;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (entry): entry is CompletionFileMeta =>
      typeof entry === "object" &&
      entry !== null &&
      "name" in entry &&
      typeof entry.name === "string" &&
      "size" in entry &&
      typeof entry.size === "number",
  );
}

export function getEditMaterialFiles(item: ScheduleItem): CompletionFileMeta[] {
  const value = item.payload?.editMaterialFiles;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (entry): entry is CompletionFileMeta =>
      typeof entry === "object" &&
      entry !== null &&
      "name" in entry &&
      typeof entry.name === "string" &&
      "size" in entry &&
      typeof entry.size === "number",
  );
}

export function getCompletedAt(item: ScheduleItem): string | null {
  const value = item.payload?.completedAt;
  return typeof value === "string" ? value : null;
}

export function getScheduleLatePublishMinutes(
  item: ScheduleItem,
): number | null {
  const value = item.payload?.latePublishMinutes;
  return typeof value === "number" ? value : null;
}
