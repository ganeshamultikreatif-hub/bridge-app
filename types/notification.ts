export type NotificationEntityType =
  | "schedule"
  | "broadcast"
  | "lead"
  | "inbox"
  | "customer"
  | "analytics";

export interface LiveNotification {
  body: string | null;
  createdAt: string;
  entityId: string | null;
  entityType: string;
  id: string;
  title: string;
  type: string;
}

export interface LiveNotificationsResponse {
  items: LiveNotification[];
  serverTime: string;
  unreadCount: number;
}

export interface InboxNotification extends LiveNotification {
  readAt: string | null;
}

export interface InboxNotificationsResponse {
  items: InboxNotification[];
  unreadCount: number;
}
