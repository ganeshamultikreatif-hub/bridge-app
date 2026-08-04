"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DashboardFilterOption } from "@/config/dashboard-filters";
import {
  HEADER_TOOLBAR_BUTTON,
  HEADER_TOOLBAR_GLYPH,
  HEADER_TOOLBAR_GLYPH_MUTED,
} from "@/config/header-toolbar";
import { Check, ChevronDown } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface DashboardFilterSelectProps {
  allLabel: string;
  allowClear?: boolean;
  className?: string;
  description?: string;
  icon: DashboardFilterOption["icon"];
  multiple?: boolean;
  onChange: (values: string[]) => void;
  options: DashboardFilterOption[];
  title: string;
  value: string[];
}

export function DashboardFilterSelect({
  allLabel,
  allowClear,
  className,
  description,
  icon: Icon,
  multiple = true,
  onChange,
  options,
  title,
  value,
}: DashboardFilterSelectProps) {
  const [open, setOpen] = useState(false);
  const canClear = allowClear ?? multiple;

  const selectionLabel = useMemo(() => {
    if (value.length === 0) {
      return allLabel;
    }

    const labels = options
      .filter((option) => value.includes(option.value))
      .map((option) => option.label);

    if (labels.length === 1) {
      return labels[0] ?? "1 selected";
    }

    return `${labels.length} selected`;
  }, [allLabel, options, value]);

  function toggle(nextValue: string) {
    if (!multiple) {
      onChange([nextValue]);
      setOpen(false);
      return;
    }

    if (value.includes(nextValue)) {
      onChange(value.filter((item) => item !== nextValue));
      return;
    }

    onChange([...value, nextValue]);
  }

  function clearAll() {
    onChange([]);
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            HEADER_TOOLBAR_BUTTON,
            "min-w-36 justify-between gap-1.5 px-2.5 font-medium text-foreground sm:min-w-40",
            value.length === 0 && "text-muted-foreground",
            className,
          )}
          type="button"
          variant="outline"
        >
          <span className="flex min-w-0 flex-1 items-center gap-1.5">
            <Icon aria-hidden className={HEADER_TOOLBAR_GLYPH} />
            <span className="truncate">{selectionLabel}</span>
          </span>
          <ChevronDown
            aria-hidden
            className={cn(
              HEADER_TOOLBAR_GLYPH_MUTED,
              "transition-transform",
              open && "rotate-180",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-2">
        <div className="px-2 pb-2 pt-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {description ??
              (value.length === 0 ? allLabel : `${value.length} selected`)}
          </p>
        </div>

        <div className="max-h-72 space-y-1 overflow-y-auto p-1">
          {canClear ? (
            <>
              <button
                aria-pressed={value.length === 0}
                className={cn(
                  "flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
                  value.length === 0
                    ? "border-primary/35 bg-primary/8"
                    : "border-transparent hover:border-border hover:bg-muted/70",
                )}
                onClick={clearAll}
                type="button"
              >
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {allLabel}
                </span>
                {value.length === 0 ? (
                  <Check aria-hidden className="size-4 text-primary" />
                ) : null}
              </button>

              <div className="px-2 py-1">
                <div className="h-px bg-border" />
              </div>
            </>
          ) : null}

          {options.map((option) => {
            const active = value.includes(option.value);
            const OptionIcon = option.icon;

            return (
              <button
                aria-pressed={active}
                className={cn(
                  "flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
                  active
                    ? "border-primary/35 bg-primary/8"
                    : "border-transparent hover:border-border hover:bg-muted/70",
                )}
                key={option.value}
                onClick={() => toggle(option.value)}
                type="button"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-white dark:bg-muted/40">
                  <OptionIcon aria-hidden className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  ) : null}
                </span>
                {active ? (
                  <Check aria-hidden className="size-4 text-primary" />
                ) : null}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
