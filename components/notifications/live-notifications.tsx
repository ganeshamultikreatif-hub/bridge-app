"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { playNotificationSound } from "@/lib/notifications/notification-sound";
import type { LiveNotificationsResponse } from "@/types/notification";

const POLL_INTERVAL_MS = 90_000;

export function LiveNotifications() {
  const sinceRef = useRef<string | null>(null);
  const primedRef = useRef(false);
  const inFlightRef = useRef(false);
  const toastedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      if (!active || inFlightRef.current) {
        return;
      }

      inFlightRef.current = true;

      try {
        const query = sinceRef.current
          ? `?since=${encodeURIComponent(sinceRef.current)}`
          : "";
        const response = await fetch(`/api/notifications/live${query}`, {
          cache: "no-store",
        });

        if (!response.ok || !active) {
          return;
        }

        const data = (await response.json()) as LiveNotificationsResponse;

        if (!active) {
          return;
        }

        const lastItem = data.items.at(-1);
        sinceRef.current = lastItem ? lastItem.createdAt : data.serverTime;

        // Skip the first fetch so existing notifications don't toast on load.
        if (!primedRef.current) {
          primedRef.current = true;
          for (const item of data.items) {
            toastedIdsRef.current.add(item.id);
          }
          return;
        }

        const freshItems = data.items.filter(
          (item) => !toastedIdsRef.current.has(item.id),
        );

        if (freshItems.length === 0) {
          return;
        }

        playNotificationSound();

        for (const item of freshItems) {
          toastedIdsRef.current.add(item.id);
          toast(item.title, {
            id: item.id,
            description: item.body ?? undefined,
          });
        }
      } catch {
        // Ignore transient network errors; next tick will retry.
      } finally {
        inFlightRef.current = false;
      }
    }

    function scheduleNext() {
      timer = setTimeout(async () => {
        if (document.visibilityState === "visible") {
          await poll();
        }

        scheduleNext();
      }, POLL_INTERVAL_MS);
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        void poll();
      }
    }

    void poll();
    scheduleNext();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      active = false;

      if (timer) {
        clearTimeout(timer);
      }

      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}
