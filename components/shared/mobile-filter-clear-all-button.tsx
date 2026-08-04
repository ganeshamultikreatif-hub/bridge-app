"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileFilterClearAllButtonProps {
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

/** Full-width clear action for mobile filter drawers. */
export function MobileFilterClearAllButton({
  className,
  disabled = false,
  onClick,
}: MobileFilterClearAllButtonProps) {
  return (
    <div className={cn("shrink-0 pt-1", className)}>
      <Button
        className="h-11 w-full rounded-2xl text-[15px] font-semibold"
        disabled={disabled}
        onClick={onClick}
        type="button"
        variant="outline"
      >
        Clear all filter
      </Button>
    </div>
  );
}
