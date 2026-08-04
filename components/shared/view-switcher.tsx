"use client";

import type { AppIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type ViewSwitcherOption<T extends string> = {
  icon: AppIcon;
  label: string;
  value: T;
};

interface ViewSwitcherProps<T extends string> {
  /** Icon-only buttons — option labels are used for accessibility only. */
  compact?: boolean;
  label?: string;
  onChange: (value: T) => void;
  options: ViewSwitcherOption<T>[];
  value: T;
}

export function ViewSwitcher<T extends string>({
  compact = false,
  label,
  onChange,
  options,
  value,
}: ViewSwitcherProps<T>) {
  return (
    <fieldset
      className={cn(
        "inline-flex min-w-0 items-center gap-2 border-0 p-0",
        compact && "gap-1",
      )}
      aria-label={label || "Tampilan"}
    >
      {label && !compact ? (
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      ) : null}
      <div
        className={cn(
          "inline-flex bg-muted p-1",
          compact ? "h-8 rounded-full" : "rounded-2xl",
        )}
      >
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-label={option.label}
              aria-pressed={isActive}
              onClick={() => onChange(option.value)}
              className={cn(
                "inline-flex items-center justify-center font-semibold transition-colors",
                compact
                  ? "size-6 rounded-full px-0"
                  : "gap-1.5 rounded-xl px-3 py-1.5 text-xs",
                isActive
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {compact ? null : option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
