"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SidebarCountBadge } from "@/components/shared/sidebar-count-badge";
import { Button } from "@/components/ui/button";
import { HEADER_TOOLBAR_GLYPH } from "@/config/header-toolbar";
import { Bell } from "@/lib/icons";
import { getNotificationHref } from "@/lib/notifications/inbox-presentation";
import type {
  InboxNotification,
  InboxNotificationsResponse,
} from "@/types/notification";

const POLL_INTERVAL_MS = 90_000;

const NotificationCenterDrawer = dynamic(
  () =>
    import("@/components/notifications/notification-center-drawer").then(
      (mod) => ({ default: mod.NotificationCenterDrawer }),
    ),
  { ssr: false },
);

export function NotificationBell() {
  const router = useRouter();
  const [items, setItems] = useState<InboxNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const activeRef = useRef(true);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/list", {
        cache: "no-store",
      });

      if (!response.ok || !activeRef.current) {
        return;
      }

      const data = (await response.json()) as InboxNotificationsResponse;

      if (!activeRef.current) {
        return;
      }

      setItems(data.items);
      setUnreadCount(data.unreadCount);
    } catch {
      // Ignore transient errors; next tick retries.
    }
  }, []);

  useEffect(() => {
    activeRef.current = true;

    void load();

    const timer = setInterval(() => {
      if (document.visibilityState === "visible") {
        void load();
      }
    }, POLL_INTERVAL_MS);

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        void load();
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      activeRef.current = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [load]);

  useEffect(() => {
    if (open) {
      void load();
    }
  }, [open, load]);

  async function markRead(id?: string) {
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(id ? { id } : {}),
    });
  }

  function handleMarkAll() {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        readAt: item.readAt ?? new Date().toISOString(),
      })),
    );
    setUnreadCount(0);
    void markRead().then(() => {
      router.refresh();
    });
  }

  function handleMarkRead(item: InboxNotification) {
    if (item.readAt) {
      return;
    }

    setItems((prev) =>
      prev.map((entry) =>
        entry.id === item.id
          ? { ...entry, readAt: new Date().toISOString() }
          : entry,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    void markRead(item.id);
  }

  function handleSelect(item: InboxNotification) {
    handleMarkRead(item);

    const href = getNotificationHref(item);
    setOpen(false);

    if (href) {
      router.push(href);
    }
  }

  function handleOpen() {
    setDrawerMounted(true);
    setOpen(true);
  }

  return (
    <>
      <Button
        aria-label="Notifikasi"
        aria-expanded={open}
        className="app-grouped-surface relative size-9 rounded-(--radius-inner) border-(--glass-shell-border) bg-(--grouped-surface) shadow-none hover:bg-white/70 dark:hover:bg-white/12"
        size="icon"
        variant="ghost"
        onClick={handleOpen}
        type="button"
      >
        <Bell className={HEADER_TOOLBAR_GLYPH} aria-hidden="true" />
        <SidebarCountBadge
          className="absolute -top-0.5 -right-0.5"
          count={unreadCount}
        />
      </Button>

      {drawerMounted ? (
        <NotificationCenterDrawer
          open={open}
          onOpenChange={setOpen}
          notifications={items}
          unreadCount={unreadCount}
          onMarkAllRead={handleMarkAll}
          onSelect={handleSelect}
          onMarkRead={handleMarkRead}
        />
      ) : null}
    </>
  );
}
