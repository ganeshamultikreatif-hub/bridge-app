import {
  CHANGELOG_STORAGE_PREFIX,
  CHANGELOG_VERSION,
} from "@/config/changelog";

export function getChangelogSeenStorageKey(userId: string): string {
  return `${CHANGELOG_STORAGE_PREFIX}:${userId}`;
}

export function readChangelogSeenVersion(userId: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(getChangelogSeenStorageKey(userId));
}

export function writeChangelogSeenVersion(
  userId: string,
  version: string = CHANGELOG_VERSION,
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(getChangelogSeenStorageKey(userId), version);
}

export function shouldShowChangelog(userId: string): boolean {
  return readChangelogSeenVersion(userId) !== CHANGELOG_VERSION;
}
