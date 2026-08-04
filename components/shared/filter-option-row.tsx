"use client";

import type { ReactNode } from "react";
import { Check } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface FilterOptionRowProps {
  active: boolean;
  description?: string;
  icon: ReactNode;
  onClick: () => void;
  title: string;
}

/** Shared selectable row for mobile/desktop filter lists (scheduler pattern). */
export function FilterOptionRow({
  active,
  description,
  icon,
  onClick,
  title,
}: FilterOptionRowProps) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
        "active:scale-[0.99]",
        active
          ? "border-primary/35 bg-primary/8"
          : "border-transparent hover:border-border hover:bg-muted/70",
      )}
      onClick={onClick}
      type="button"
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg border bg-white dark:bg-muted/40",
          active ? "border-primary/20" : "border-border/70",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
      {active ? (
        <Check aria-hidden className="size-4 shrink-0 text-primary" />
      ) : null}
    </button>
  );
}
