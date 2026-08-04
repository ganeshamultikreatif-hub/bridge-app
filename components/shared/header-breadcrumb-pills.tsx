"use client";

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { BreadcrumbItem as Crumb } from "@/config/breadcrumbs";
import { APP_GLASS_SURFACE } from "@/config/shared-surfaces";
import { ChevronRight, InfoIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface HeaderBreadcrumbPillsProps {
  items: Crumb[];
  className?: string;
}

function PillLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("max-w-[10rem] truncate whitespace-nowrap", className)}>
      {children}
    </span>
  );
}

export function HeaderBreadcrumbPills({
  items,
  className,
}: HeaderBreadcrumbPillsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="breadcrumb"
      className={cn(
        "pointer-events-auto flex h-11 w-fit max-w-full items-center rounded-full p-1",
        APP_GLASS_SURFACE,
        "overflow-x-auto overflow-y-visible no-scrollbar",
        className,
      )}
    >
      <ol className="flex w-fit items-center pl-0.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;
          const zIndex = index + 1;

          const pillClass = cn(
            "relative inline-flex h-8 max-w-[14rem] items-center gap-1.5 rounded-full text-xs font-medium transition-[background-color,color,box-shadow,transform]",
            "pl-3 backdrop-blur-xl!",
            // Extra right padding on stacked (non-last) pills so label clears the overlap.
            isLast ? (item.description ? "pr-1.5" : "pr-3") : "pr-9",
            !isFirst && "-ml-7",
            "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_0.5px_1px_rgba(15,23,42,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.22),0_0.5px_1px_rgba(0,0,0,0.12)]",
            isLast
              ? "bg-foreground/90 text-background dark:bg-white dark:text-black"
              : "bg-white/55 text-foreground/75 hover:bg-white/75 hover:text-foreground dark:bg-white/10 dark:text-white/75 dark:hover:bg-white/16 dark:hover:text-white",
          );

          const descriptionButton =
            isLast && item.description ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    aria-label={`Tentang ${item.label}`}
                    className={cn(
                      "inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
                      "text-background/70 hover:bg-background/15 hover:text-background",
                      "dark:text-black/55 dark:hover:bg-black/10 dark:hover:text-black",
                    )}
                    type="button"
                  >
                    <InfoIcon className="size-3" aria-hidden="true" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  className="max-w-64 text-xs leading-relaxed"
                  side="bottom"
                >
                  {item.description}
                </TooltipContent>
              </Tooltip>
            ) : null;

          return (
            <li
              key={`${item.label}-${index}`}
              className="relative flex shrink-0 items-center"
              style={{ zIndex }}
            >
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={pillClass}
                >
                  {!isFirst ? (
                    <ChevronRight
                      className={cn(
                        "size-3 shrink-0 opacity-55",
                        isLast && "opacity-70",
                      )}
                      aria-hidden
                    />
                  ) : null}
                  <PillLabel>{item.label}</PillLabel>
                  {descriptionButton}
                </span>
              ) : (
                <Link href={item.href} className={pillClass}>
                  {!isFirst ? (
                    <ChevronRight
                      className="size-3 shrink-0 opacity-55"
                      aria-hidden
                    />
                  ) : null}
                  <PillLabel>{item.label}</PillLabel>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
