"use client";

import type { ReactNode } from "react";
import {
  MOBILE_ACTION_DOCK,
  MOBILE_ACTION_PILL,
  MOBILE_ACTION_PILL_FIT,
} from "@/config/mobile-floating";
import { APP_FLOATING_SURFACE } from "@/config/shared-surfaces";
import { cn } from "@/lib/utils";

interface MobileActionDockProps {
  children: ReactNode;
  className?: string;
  /** Align dock contents end when the pill is content-sized. */
  fit?: boolean;
}

/** Fixed bottom action dock — full-width on mobile, corner on desktop. */
export function MobileActionDock({
  children,
  className,
  fit = false,
}: MobileActionDockProps) {
  return (
    <div
      className={cn(MOBILE_ACTION_DOCK, fit && "max-md:items-end", className)}
    >
      {children}
    </div>
  );
}

interface MobileActionPillProps {
  children: ReactNode;
  className?: string;
  /** Content-sized pill when exactly 2 actions. Default stretches full width. */
  fit?: boolean;
}

/** Frosted pill that hosts dock action buttons. */
export function MobileActionPill({
  children,
  className,
  fit = false,
}: MobileActionPillProps) {
  return (
    <div
      className={cn(
        fit ? MOBILE_ACTION_PILL_FIT : MOBILE_ACTION_PILL,
        APP_FLOATING_SURFACE,
        className,
      )}
    >
      {children}
    </div>
  );
}
