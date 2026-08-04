export type ActivityEntityType =
  | "schedule"
  | "media"
  | "user"
  | "attachment"
  | "kpi_period";

export type ActivityAction =
  | "schedule.created"
  | "schedule.updated"
  | "schedule.status_changed"
  | "schedule.completed"
  | "schedule.deleted"
  | "schedule.archived"
  | "schedule.restored"
  | "attachment.uploaded"
  | "attachment.deleted"
  | "media.deleted"
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "kpi.targets_updated";

export type ActivityLogId = string & { readonly brand: "ActivityLogId" };

export interface ActivityLogItem {
  id: ActivityLogId;
  action: ActivityAction;
  entityType: ActivityEntityType;
  entityId: string | null;
  message: string;
  createdAt: string;
  isRead: boolean;
  actor: {
    id: string;
    username: string;
  } | null;
}

export interface ActivityListResult {
  items: ActivityLogItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  unreadCount: number;
}
