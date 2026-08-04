"use client";

import { SIDEBAR_OPEN_STORAGE_KEY } from "@/config/sidebar";

export function readStoredSidebarOpen(defaultOpen = true): boolean {
  if (typeof window === "undefined") {
    return defaultOpen;
  }

  const stored = window.localStorage.getItem(SIDEBAR_OPEN_STORAGE_KEY);
  if (stored === "1") {
    return true;
  }

  if (stored === "0") {
    return false;
  }

  return defaultOpen;
}

export function writeStoredSidebarOpen(open: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SIDEBAR_OPEN_STORAGE_KEY, open ? "1" : "0");
}
