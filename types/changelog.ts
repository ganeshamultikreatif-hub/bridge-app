export type ChangelogItemKind = "feature" | "improvement" | "fix";

export interface ChangelogItem {
  description: string;
  kind: ChangelogItemKind;
  title: string;
}

export interface ChangelogRelease {
  items: ChangelogItem[];
  /** ISO date `YYYY-MM-DD` — shown in the dialog subtitle. */
  publishedAt: string;
  summary: string;
  title: string;
  /** Bump this string on every deploy that should show What's New. */
  version: string;
}
