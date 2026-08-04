"use client";

import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { DashboardDateRangePickerPanel } from "@/components/dashboard/dashboard-date-range-picker-panel";
import { FormNestedDrawer } from "@/components/shared/form-nested-drawer";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HEADER_TOOLBAR_BUTTON,
  HEADER_TOOLBAR_GLYPH,
} from "@/config/header-toolbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { parseScheduleDate } from "@/lib/calendar/date-utils";
import {
  type DashboardDateRange,
  dashboardRangeToDateRange,
  dateRangeToDashboardRange,
  formatDashboardDateRangeLabel,
} from "@/lib/dashboard/date-range";
import {
  type DashboardPeriodPreset,
  getPresetDateRange,
  matchPeriodPreset,
} from "@/lib/dashboard/filters";
import { CalendarDays, Check } from "@/lib/icons";
import { cn } from "@/lib/utils";

const PRESET_OPTIONS: Array<{
  value: Exclude<DashboardPeriodPreset, "custom">;
  label: string;
  description: string;
}> = [
  {
    value: "this-month",
    label: "This month",
    description: "Current calendar month",
  },
  {
    value: "last-7-days",
    label: "Last 7 days",
    description: "Rolling week",
  },
  {
    value: "last-30-days",
    label: "Last 30 days",
    description: "Rolling month",
  },
  {
    value: "this-quarter",
    label: "This quarter",
    description: "Current quarter",
  },
];

interface DashboardDateFilterProps {
  className?: string;
  onChange: (range: DashboardDateRange) => void;
  value: DashboardDateRange;
}

export function DashboardDateFilter({
  className,
  onChange,
  value,
}: DashboardDateFilterProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(
    dashboardRangeToDateRange(value),
  );
  const activePreset = matchPeriodPreset(value);
  const rangeLabel = formatDashboardDateRangeLabel(value);
  const calendarMonth = parseScheduleDate(value.from);

  useEffect(() => {
    setDraftRange(dashboardRangeToDateRange(value));
  }, [value]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setDraftRange(dashboardRangeToDateRange(value));
    }
  }

  function handleCancel() {
    setDraftRange(dashboardRangeToDateRange(value));
    setOpen(false);
  }

  function handleConfirm() {
    const parsed = dateRangeToDashboardRange(draftRange);
    if (!parsed) return;
    onChange(parsed);
    setOpen(false);
  }

  function handlePreset(preset: Exclude<DashboardPeriodPreset, "custom">) {
    const next = getPresetDateRange(preset);
    onChange(next);
    setDraftRange(dashboardRangeToDateRange(next));
    setOpen(false);
  }

  const trigger = (
    <Button
      type="button"
      variant="outline"
      className={cn(
        HEADER_TOOLBAR_BUTTON,
        "min-w-40 justify-between gap-1.5 px-2.5 font-medium text-foreground",
        className,
      )}
      onClick={isMobile ? () => handleOpenChange(true) : undefined}
    >
      <span className="flex min-w-0 flex-1 items-center gap-1.5">
        <CalendarDays aria-hidden className={HEADER_TOOLBAR_GLYPH} />
        <span className="truncate">{rangeLabel}</span>
      </span>
    </Button>
  );

  const panel = (
    <div className="flex min-h-0 w-full flex-col gap-2 p-2 sm:w-[34rem]">
      <div className="px-2 pt-1">
        <p className="text-sm font-semibold">Date</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Presets or custom range · scopes every widget
        </p>
      </div>

      <div className="grid gap-1 p-1 sm:grid-cols-2">
        {PRESET_OPTIONS.map((option) => {
          const active = activePreset === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors",
                active
                  ? "border-primary/35 bg-primary/8"
                  : "border-transparent hover:border-border hover:bg-muted/70",
              )}
              onClick={() => handlePreset(option.value)}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {option.label}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
              {active ? (
                <Check aria-hidden className="size-4 text-primary" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="px-2">
        <div className="h-px bg-border" />
        <p className="py-2 text-xs font-medium text-muted-foreground">
          Custom range
          {activePreset === "custom" ? ` · ${rangeLabel}` : ""}
        </p>
      </div>

      <DashboardDateRangePickerPanel
        className="min-h-0 flex-1"
        defaultMonth={calendarMonth}
        draftRange={draftRange}
        numberOfMonths={isMobile ? 1 : 2}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        onDraftChange={setDraftRange}
      />
    </div>
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        <FormNestedDrawer
          backLabel="Filter"
          onOpenChange={handleOpenChange}
          open={open}
          title="Date"
        >
          {panel}
        </FormNestedDrawer>
      </>
    );
  }

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        {panel}
      </PopoverContent>
    </Popover>
  );
}
