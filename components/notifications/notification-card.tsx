"use client";

import { NotificationUnreadDot } from "@/components/notifications/notification-unread-dot";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { NOTIFICATION_CARD_SURFACE } from "@/config/notification-center";
import { formatNotificationRelativeTime } from "@/lib/notifications/format-relative";
import { getInboxNotificationPresentation } from "@/lib/notifications/inbox-presentation";
import { cn } from "@/lib/utils";
import type { InboxNotification } from "@/types/notification";

interface NotificationCardProps {
  notification: InboxNotification;
  onSelect?: (notification: InboxNotification) => void;
  onMarkRead?: (notification: InboxNotification) => void;
}

export function NotificationCard({
  notification,
  onSelect,
  onMarkRead,
}: NotificationCardProps) {
  const { icon: Icon, tone } = getInboxNotificationPresentation(notification);
  const isUnread = !notification.readAt;

  return (
    <div
      className={cn(
        NOTIFICATION_CARD_SURFACE,
        "group relative flex w-full items-start gap-3 transition-colors hover:bg-white/70 dark:hover:bg-white/14",
        isUnread && "bg-white/90 dark:bg-black/70",
      )}
    >
      <button
        type="button"
        className="flex min-w-0 flex-1 items-start gap-3 text-left"
        onClick={() => onSelect?.(notification)}
      >
        <span className="relative mt-0.5 shrink-0">
          <SidebarAppIcon icon={Icon} tone={tone} />
          {isUnread ? <NotificationUnreadDot /> : null}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span
              className={cn(
                "truncate text-sm leading-tight",
                isUnread ? "font-semibold" : "font-medium",
              )}
            >
              {notification.title}
            </span>
            <span
              className={cn(
                "shrink-0 text-[11px] text-muted-foreground tabular-nums transition-opacity",
                onMarkRead &&
                  isUnread &&
                  "group-hover:opacity-0 group-focus-within:opacity-0",
              )}
            >
              {formatNotificationRelativeTime(notification.createdAt)}
            </span>
          </span>
          {notification.body ? (
            <span className="mt-0.5 line-clamp-2 block text-muted-foreground text-xs leading-relaxed">
              {notification.body}
            </span>
          ) : null}
        </span>
      </button>

      {onMarkRead && isUnread ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onMarkRead(notification);
          }}
          className={cn(
            "absolute top-3 right-3 text-[11px] font-medium text-primary",
            "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
            "hover:underline focus-visible:opacity-100 focus-visible:outline-none",
          )}
          aria-label={`Tandai ${notification.title} sudah dibaca`}
        >
          Baca
        </button>
      ) : null}
    </div>
  );
}
