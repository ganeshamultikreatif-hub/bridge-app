"use client";

import { type ReactNode, useState } from "react";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/shared/app-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { APP_GLASS_SURFACE } from "@/config/shared-surfaces";
import { InfoIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface HeaderPageNameProps {
  className?: string;
  description?: string | null;
  /** Rich help body — opens a modal instead of a short tooltip. */
  helpContent?: ReactNode;
  helpTitle?: string;
  label: string;
  /** Compact control beside the page name (e.g. push on/off). */
  trailing?: ReactNode;
}

export function HeaderPageName({
  className,
  description,
  helpContent,
  helpTitle,
  label,
  trailing,
}: HeaderPageNameProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  const hasHelp = Boolean(helpContent) || Boolean(description);

  return (
    <div
      className={cn(
        "pointer-events-auto flex h-11 w-fit min-w-0 max-w-[50%] items-center gap-1 rounded-full pl-3.5 pr-2 text-base font-semibold text-foreground md:max-w-none",
        APP_GLASS_SURFACE,
        className,
      )}
    >
      <span className="truncate">{label}</span>
      {trailing}
      {hasHelp ? (
        helpContent ? (
          <AppDialog onOpenChange={setHelpOpen} open={helpOpen}>
            <button
              aria-label={`Tentang ${label}`}
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
              onClick={() => setHelpOpen(true)}
              type="button"
            >
              <InfoIcon className="size-3.5" aria-hidden="true" />
            </button>
            <AppDialogContent
              className="flex max-h-[min(88dvh,720px)] flex-col gap-0 overflow-hidden p-0"
              size="lg"
            >
              <AppDialogHeader className="shrink-0 border-b border-border px-5 py-4 text-left">
                <AppDialogTitle>
                  {helpTitle ?? `Tentang ${label}`}
                </AppDialogTitle>
                {description ? (
                  <AppDialogDescription>{description}</AppDialogDescription>
                ) : null}
              </AppDialogHeader>
              <AppDialogBody className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                {helpContent}
              </AppDialogBody>
            </AppDialogContent>
          </AppDialog>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label={`Tentang ${label}`}
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                type="button"
              >
                <InfoIcon className="size-3.5" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              className="max-w-64 text-xs leading-relaxed"
              side="bottom"
            >
              {description}
            </TooltipContent>
          </Tooltip>
        )
      ) : null}
    </div>
  );
}
