export type ScheduleStatus =
  | "todo"
  | "in_progress"
  | "ready_for_review"
  | "ready_to_publish"
  | "published"
  | "done"
  | "complete";

export type SchedulePriority = "low" | "medium" | "high" | "urgent";

export type ScheduleType =
  | "sosmed_content"
  | "creative_request"
  | "custom_schedule"
  | "meeting_room";

export type MeetingRoomType = "large" | "medium" | "smoking";

export type SosmedContentType = "image" | "carousel_image" | "video" | "story";

export type ScheduleId = string & { readonly brand: "ScheduleId" };

export interface ScheduleItem {
  id: ScheduleId;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  time: string;
  status: ScheduleStatus;
  priority?: SchedulePriority;
  scheduleType?: ScheduleType;
  assignment?: string;
  reviewers?: string;
  category: string;
  brandSlug?: string;
  countsTowardKpi?: boolean;
  isCampaignAds?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  archivedAt?: string;
  payload?: Record<string, unknown>;
}
