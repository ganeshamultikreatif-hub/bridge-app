import { formatAppDateTime } from "@/lib/datetime/format";

/** Compact relative label for notification cards (e.g. `12m`, `3j`). */
export function formatNotificationRelativeTime(value: string): string {
  const diffMs = Date.now() - new Date(value).getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) {
    return formatAppDateTime(value);
  }

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "baru";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}h`;

  return formatAppDateTime(value);
}
