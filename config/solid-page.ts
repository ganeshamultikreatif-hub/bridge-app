import { MOBILE_NATIVE_SHELL } from "@/config/mobile-chrome";

/**
 * Non-home page shell — glass card on desktop only.
 * Mobile: `max-md:contents` dissolves the panel so nothing clips edge-to-edge.
 */
export const SOLID_PAGE_SHELL = [MOBILE_NATIVE_SHELL, "mt-0 md:min-h-0"].join(
  " ",
);

/** Inner wrapper under GlassPanel — also dissolves on mobile (wang plans-shell). */
export const SOLID_PAGE_INNER = [
  "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
  "max-md:contents",
].join(" ");

/** Scroll body for solid pages — same inset rhythm as home. */
export const SOLID_PAGE_SCROLL = [
  "flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto",
  "overscroll-y-contain",
].join(" ");

export const SOLID_PAGE_SCROLL_INSET = "px-3 md:px-4";

export const SOLID_PAGE_SCROLL_BOTTOM = "pb-3 md:pb-4";
