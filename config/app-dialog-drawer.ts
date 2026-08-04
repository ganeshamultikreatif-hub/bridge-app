import { MODAL_PANEL_SURFACE } from "@/config/glass";
import { MOBILE_TOP_BAR_ORB_BUTTON } from "@/config/mobile-chrome";
import {
  MOBILE_BOTTOM_DRAWER_POPUP,
  MOBILE_BOTTOM_DRAWER_POPUP_TALL,
} from "@/config/mobile-layout";

/** Glass surface for mobile bottom sheets (root + nested). */
export const APP_DIALOG_DRAWER_SURFACE = [
  MODAL_PANEL_SURFACE,
  MOBILE_BOTTOM_DRAWER_POPUP,
  "mt-0! flex flex-col gap-0 overflow-hidden border-0 p-0",
].join(" ");

/** Tall sheet for forms / detail panels. */
export const APP_DIALOG_DRAWER_SURFACE_TALL = [
  APP_DIALOG_DRAWER_SURFACE,
  MOBILE_BOTTOM_DRAWER_POPUP_TALL,
].join(" ");

/** Nested drawer header — orb back · title · orb close. */
export const NESTED_DRAWER_HEADER = [
  "relative flex min-h-14 shrink-0 items-center justify-center",
  "border-b border-black/8 px-3 py-1.5 dark:border-white/10",
].join(" ");

export const NESTED_DRAWER_TITLE = [
  "max-w-[calc(100%-7.5rem)] truncate px-1",
  "text-center text-[17px] font-semibold leading-snug tracking-tight text-foreground",
].join(" ");

/** Nested-drawer back/close orb — same as top bar, no drop shadow. */
export const DRAWER_ORB_BUTTON = [
  MOBILE_TOP_BAR_ORB_BUTTON,
  "shadow-none!",
].join(" ");
