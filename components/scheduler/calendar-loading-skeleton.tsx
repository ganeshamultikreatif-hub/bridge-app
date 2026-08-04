import { Skeleton } from "@/components/ui/skeleton";
import { WEEKDAYS } from "@/config/calendar.constants";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { cn } from "@/lib/utils";

interface CalendarLoadingSkeletonProps {
  /** When true, render grid only (parent already provides the panel). */
  embedded?: boolean;
}

export function CalendarLoadingSkeleton({
  embedded = false,
}: CalendarLoadingSkeletonProps) {
  const grid = (
    <div className="isolate overflow-hidden rounded-[inherit]">
      <div className="grid grid-cols-7 border-b border-border bg-muted p-3">
        {WEEKDAYS.map((weekday) => (
          <Skeleton className="mx-auto h-3 w-8 rounded-full" key={weekday.id} />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-border p-px">
        {Array.from({ length: 35 }, (_, index) => (
          <Skeleton
            className="min-h-24 rounded-none bg-card md:min-h-40"
            key={`s${index + 1}`}
          />
        ))}
      </div>
    </div>
  );

  if (embedded) {
    return (
      <output
        aria-busy="true"
        aria-label="Loading calendar month"
        className="mt-5 block"
      >
        {grid}
      </output>
    );
  }

  return (
    <output
      aria-busy="true"
      aria-label="Loading calendar month"
      className="mt-5 block"
    >
      <div className={cn(APP_PANEL_SURFACE)}>{grid}</div>
    </output>
  );
}
