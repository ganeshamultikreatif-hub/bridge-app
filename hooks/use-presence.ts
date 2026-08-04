"use client";

import { useCallback, useEffect, useState } from "react";
import { getPresenceAction } from "@/actions/presence.actions";
import { PRESENCE_POLL_INTERVAL_MS } from "@/config/presence";
import type { PresenceSnapshot } from "@/types/presence";

const EMPTY_SNAPSHOT: PresenceSnapshot = {
  onlineCount: 0,
  users: [],
  loginHistory: [],
  fetchedAt: "",
};

interface UsePresenceOptions {
  /** When true, keep polling (presence dialog open). Otherwise fetch once. */
  active?: boolean;
}

export function usePresence({ active = false }: UsePresenceOptions = {}) {
  const [snapshot, setSnapshot] = useState<PresenceSnapshot>(EMPTY_SNAPSHOT);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const result = await getPresenceAction();
    if (result.success) {
      setSnapshot(result.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    async function tick() {
      if (cancelled || document.visibilityState === "hidden") {
        return;
      }
      await refresh();
    }

    void tick();

    if (active) {
      timer = setInterval(() => {
        void tick();
      }, PRESENCE_POLL_INTERVAL_MS);
    }

    function onVisible() {
      if (document.visibilityState === "visible" && active) {
        void tick();
      }
    }

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      if (timer) {
        clearInterval(timer);
      }
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [active, refresh]);

  return {
    onlineCount: snapshot.onlineCount,
    users: snapshot.users,
    loginHistory: snapshot.loginHistory,
    isLoading,
    refresh,
  };
}
