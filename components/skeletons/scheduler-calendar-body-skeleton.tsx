import { CalendarLoadingSkeleton } from "@/components/scheduler/calendar-loading-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { cn } from "@/lib/utils";

/**
 * Calendar route body — toolbar chrome + month grid.
 * Shell (sidebar/header) stays mounted; only this body flashes.
 */
export function SchedulerCalendarBodySkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat kalender" className="space-y-3">
      <section
        className={cn(
          APP_PANEL_SURFACE,
          "rounded-[1.5rem] p-3 sm:rounded-[2rem] sm:p-5 lg:p-6",
        )}
      >
        <div className="hidden items-center justify-between gap-3 md:flex">
          <div className="flex items-center gap-2">
            <Skeleton className="h-11 w-28 rounded-2xl" />
            <Skeleton className="h-11 w-36 rounded-2xl" />
            <Skeleton className="h-11 w-24 rounded-2xl" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-11 w-40 rounded-2xl" />
            <Skeleton className="h-11 w-28 rounded-2xl" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 md:hidden">
          <Skeleton className="h-9 w-36 rounded-xl" />
          <Skeleton className="size-9 rounded-full" />
        </div>

        <CalendarLoadingSkeleton embedded />
      </section>
    </div>
  );
}
