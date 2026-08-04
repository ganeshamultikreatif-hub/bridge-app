"use client";

import { useState } from "react";
import { NotificationCenterList } from "@/components/notifications/notification-center-list";
import { NotificationCenterMoreButton } from "@/components/notifications/notification-center-more-button";
import { NotificationCenterWidgets } from "@/components/notifications/notification-center-widgets";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  NOTIFICATION_CENTER_SURFACE,
  NOTIFICATION_CENTER_VISIBLE_COUNT,
} from "@/config/notification-center";
import { CheckIcon, XIcon } from "@/lib/icons";
import type { InboxNotification } from "@/types/notification";

interface NotificationCenterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: InboxNotification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onSelect: (notification: InboxNotification) => void;
  onMarkRead: (notification: InboxNotification) => void;
}

export function NotificationCenterDrawer({
  open,
  onOpenChange,
  notifications,
  unreadCount,
  onMarkAllRead,
  onSelect,
  onMarkRead,
}: NotificationCenterDrawerProps) {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded
    ? notifications
    : notifications.slice(0, NOTIFICATION_CENTER_VISIBLE_COUNT);
  const remaining = Math.max(
    0,
    notifications.length - NOTIFICATION_CENTER_VISIBLE_COUNT,
  );

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          setExpanded(false);
        }
      }}
    >
      <SheetContent
        side="right"
        showCloseButton={false}
        className={NOTIFICATION_CENTER_SURFACE}
      >
        <SheetHeader className="flex-row items-center justify-between gap-3 space-y-0 px-5 py-4 text-left">
          <div className="min-w-0">
            <SheetTitle className="text-[15px]">Pusat Notifikasi</SheetTitle>
            <SheetDescription className="text-xs">
              {unreadCount > 0
                ? `${unreadCount} belum dibaca`
                : "Semua sudah dibaca"}
            </SheetDescription>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {unreadCount > 0 ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 gap-1.5 rounded-full bg-white/45 px-3 text-xs dark:bg-secondary"
                onClick={onMarkAllRead}
              >
                <CheckIcon className="size-3.5" />
                Baca semua
              </Button>
            ) : null}
            <SheetClose asChild>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className="size-8 shrink-0 rounded-full bg-white/45 dark:bg-secondary"
                aria-label="Tutup pusat notifikasi"
              >
                <XIcon className="size-3.5" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
          <section aria-label="Notifikasi" className="space-y-2">
            <NotificationCenterList
              notifications={visible}
              onSelect={onSelect}
              onMarkRead={onMarkRead}
            />
            <NotificationCenterMoreButton
              remainingCount={remaining}
              expanded={expanded}
              onToggle={() => setExpanded((current) => !current)}
            />
          </section>

          <NotificationCenterWidgets />
        </div>
      </SheetContent>
    </Sheet>
  );
}
