import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Full-width touch targets for date/toolbar controls inside filter drawers. */
export const MOBILE_FILTER_CONTROL_SLOT =
  "min-w-0 [&_button]:h-11 [&_button]:w-full [&_button]:justify-between [&_button]:rounded-2xl [&_button]:px-3.5 [&_button]:text-[15px] [&_[data-slot=select-trigger]]:h-11 [&_[data-slot=select-trigger]]:w-full [&_[data-slot=select-trigger]]:rounded-2xl";

interface MobileFilterControlSlotProps {
  children: ReactNode;
  className?: string;
}

export function MobileFilterControlSlot({
  children,
  className,
}: MobileFilterControlSlotProps) {
  return (
    <div className={cn(MOBILE_FILTER_CONTROL_SLOT, className)}>{children}</div>
  );
}
