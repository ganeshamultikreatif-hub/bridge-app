import type { InboxNotification, LiveNotification } from "@/types/notification";

/** ponytail: in-memory Bridge inbox until real notification API exists. */
let notifications: InboxNotification[] = [
  {
    id: "n_bcast_done",
    type: "broadcast.finished",
    title: "Broadcast Finished",
    body: "Promo April selesai · 1.240 delivered · 214 replies",
    entityType: "broadcast",
    entityId: "b1",
    createdAt: "2026-08-04T09:45:00+07:00",
    readAt: null,
  },
  {
    id: "n_lead_assign",
    type: "lead.assigned",
    title: "Lead Assigned",
    body: "PT Nusantara Logistik → Raka (Sales) · status New",
    entityType: "lead",
    entityId: "l1",
    createdAt: "2026-08-04T09:22:00+07:00",
    readAt: null,
  },
  {
    id: "n_inbox_reply",
    type: "inbox.replied",
    title: "Customer Replied",
    body: "Farah Kusuma membalas Welcome Series · CS",
    entityType: "inbox",
    entityId: "c_farah",
    createdAt: "2026-08-04T08:58:00+07:00",
    readAt: null,
  },
  {
    id: "n_merge",
    type: "customer.merge",
    title: "Merge Suggested",
    body: "WA cocok · Farah Kusuma — tinjau Division + Sales",
    entityType: "customer",
    entityId: "cus_007",
    createdAt: "2026-08-04T08:40:00+07:00",
    readAt: "2026-08-04T08:41:00+07:00",
  },
  {
    id: "n_target",
    type: "analytics.target",
    title: "Closed vs Target",
    body: "Marketing 82% of monthly closed target",
    entityType: "analytics",
    entityId: null,
    createdAt: "2026-08-03T18:10:00+07:00",
    readAt: "2026-08-03T19:00:00+07:00",
  },
  {
    id: "n_fail",
    type: "broadcast.failed",
    title: "Delivery Issues",
    body: "Follow-up batch · 150 pending marked failed",
    entityType: "broadcast",
    entityId: "b4",
    createdAt: "2026-08-03T16:30:00+07:00",
    readAt: null,
  },
];

function unreadCount(): number {
  return notifications.filter((item) => !item.readAt).length;
}

export function listInboxNotifications(): {
  items: InboxNotification[];
  unreadCount: number;
} {
  const items = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return { items, unreadCount: unreadCount() };
}

export function listLiveNotifications(since?: string | null): {
  items: LiveNotification[];
  serverTime: string;
  unreadCount: number;
} {
  const serverTime = new Date().toISOString();
  const sinceMs = since ? new Date(since).getTime() : null;
  const items = notifications
    .filter((item) =>
      sinceMs == null ? true : new Date(item.createdAt).getTime() > sinceMs,
    )
    .map(({ readAt: _readAt, ...item }) => item)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  return { items, serverTime, unreadCount: unreadCount() };
}

export function markNotificationRead(id?: string): void {
  const now = new Date().toISOString();
  if (!id) {
    notifications = notifications.map((item) =>
      item.readAt ? item : { ...item, readAt: now },
    );
    return;
  }

  notifications = notifications.map((item) =>
    item.id === id && !item.readAt ? { ...item, readAt: now } : item,
  );
}
