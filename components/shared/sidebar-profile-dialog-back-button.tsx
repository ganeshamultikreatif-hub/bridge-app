"use client";

import { Button } from "@/components/ui/button";
import { CaretLeftIcon } from "@/lib/icons";

interface SidebarProfileDialogBackButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

export function SidebarProfileDialogBackButton({
  disabled = false,
  onClick,
}: SidebarProfileDialogBackButtonProps) {
  return (
    <Button
      aria-label="Back to profile"
      className="size-8 shrink-0 rounded-full"
      disabled={disabled}
      onClick={onClick}
      size="icon"
      type="button"
      variant="ghost"
    >
      <CaretLeftIcon className="size-4" aria-hidden="true" />
    </Button>
  );
}
