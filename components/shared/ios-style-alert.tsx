"use client";

import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogTitle,
} from "@/components/shared/app-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IosStyleAlertProps {
  className?: string;
  confirmLabel?: string;
  message: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title?: string;
}

/**
 * Compact single-action alert on the shared AppDialog shell.
 */
export function IosStyleAlert({
  className,
  confirmLabel = "OK",
  message,
  onOpenChange,
  open,
  title,
}: IosStyleAlertProps) {
  return (
    <AppDialog forceDialog onOpenChange={onOpenChange} open={open}>
      <AppDialogContent
        showCloseButton={false}
        size="sm"
        className={cn(
          "w-[min(100%-2rem,18rem)] overflow-hidden text-center",
          className,
        )}
      >
        <div className="space-y-2 px-5 pt-5 pb-4">
          {title ? (
            <AppDialogTitle className="text-center text-[17px] font-semibold leading-snug">
              {title}
            </AppDialogTitle>
          ) : (
            <AppDialogTitle className="sr-only">Notifikasi</AppDialogTitle>
          )}
          <AppDialogDescription className="text-center text-[15px] leading-relaxed text-foreground/85">
            {message}
          </AppDialogDescription>
        </div>

        <div className="border-t border-(--separator)">
          <Button
            className="h-12 w-full rounded-none bg-transparent text-[17px] font-semibold text-primary hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => onOpenChange(false)}
            type="button"
            variant="ghost"
          >
            {confirmLabel}
          </Button>
        </div>
      </AppDialogContent>
    </AppDialog>
  );
}
