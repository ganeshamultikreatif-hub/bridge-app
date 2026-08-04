"use client";

import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { dateRangeToDashboardRange } from "@/lib/dashboard/date-range";
import { cn } from "@/lib/utils";

interface DashboardDateRangePickerPanelProps {
  className?: string;
  defaultMonth?: Date;
  draftRange: DateRange | undefined;
  numberOfMonths?: number;
  onCancel: () => void;
  onConfirm: () => void;
  onDraftChange: (range: DateRange | undefined) => void;
}

/** Calendar + confirm — draft only until Terapkan. */
export function DashboardDateRangePickerPanel({
  className,
  defaultMonth,
  draftRange,
  numberOfMonths = 1,
  onCancel,
  onConfirm,
  onDraftChange,
}: DashboardDateRangePickerPanelProps) {
  const canConfirm = Boolean(dateRangeToDashboardRange(draftRange));
  const calendarMonth = draftRange?.from ?? defaultMonth;

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="flex justify-center overflow-x-auto px-2 py-2">
        <Calendar
          mode="range"
          numberOfMonths={numberOfMonths}
          onSelect={onDraftChange}
          {...(calendarMonth ? { defaultMonth: calendarMonth } : {})}
          {...(draftRange ? { selected: draftRange } : {})}
        />
      </div>

      <div className="flex shrink-0 gap-2 border-t border-border/70 px-3 py-3">
        <Button
          className="h-10 flex-1 rounded-xl"
          onClick={onCancel}
          type="button"
          variant="secondary"
        >
          Batal
        </Button>
        <Button
          className="h-10 flex-1 rounded-xl"
          disabled={!canConfirm}
          onClick={onConfirm}
          type="button"
        >
          Terapkan
        </Button>
      </div>
    </div>
  );
}
