"use server";

import type { PresenceSnapshot } from "@/types/presence";

/** ponytail: stub until CEP presence lands. */
export async function getPresenceAction(): Promise<
  { success: true; data: PresenceSnapshot } | { success: false; error: string }
> {
  return {
    success: true,
    data: {
      onlineCount: 0,
      users: [],
      loginHistory: [],
      fetchedAt: new Date().toISOString(),
    },
  };
}
