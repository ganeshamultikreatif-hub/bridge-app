"use client";

import { NotificationCard } from "@/components/notifications/notification-card";
import type { InboxNotification } from "@/types/notification";

interface NotificationCenterListProps {
  notifications: InboxNotification[];
  onSelect: (notification: InboxNotification) => void;
  onMarkRead: (notification: InboxNotification) => void;
}

export function NotificationCenterList({
  notifications,
  onSelect,
  onMarkRead,
}: NotificationCenterListProps) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-[1.15rem] bg-white/40 px-4 py-8 text-center dark:bg-white/8">
        <p className="font-medium text-sm">Belum ada notifikasi</p>
        <p className="mt-1 text-muted-foreground text-xs">
          Aktivitas jadwal akan muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {notifications.map((notification) => (
        <li key={notification.id}>
          <NotificationCard
            notification={notification}
            onSelect={onSelect}
            onMarkRead={onMarkRead}
          />
        </li>
      ))}
    </ul>
  );
}
