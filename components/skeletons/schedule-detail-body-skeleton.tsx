import { Skeleton } from "@/components/ui/skeleton";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { SCHEDULE_DETAIL_CONTENT_WIDTH } from "@/config/spacing";
import { cn } from "@/lib/utils";

/**
 * Body-only schedule detail placeholder — header chrome stays mounted.
 * Kept intentionally light (few nodes) for near-instant paint on navigation.
 */
export function ScheduleDetailBodySkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Memuat detail jadwal"
      className={cn(SCHEDULE_DETAIL_CONTENT_WIDTH, "space-y-6")}
    >
      <section
        className={cn(APP_PANEL_SURFACE, "rounded-[1.75rem] p-5 sm:p-6")}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
        <Skeleton className="mt-5 h-8 w-3/4 max-w-xl" />
        <Skeleton className="mt-3 h-4 w-1/2 max-w-md" />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="min-w-0 space-y-4">
          <section className={cn(APP_PANEL_SURFACE, "rounded-2xl p-5")}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
            <Skeleton className="mt-5 h-12 w-full rounded-xl" />
          </section>

          <section className={cn(APP_PANEL_SURFACE, "rounded-2xl p-5")}>
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-xl" />
              <Skeleton className="h-3 w-36" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          </section>

          <section className={cn(APP_PANEL_SURFACE, "rounded-2xl p-5")}>
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-xl" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-3 h-28 w-full rounded-xl" />
            </div>
          </section>
        </div>

        <aside className="hidden space-y-4 lg:block">
          <section className={cn(APP_PANEL_SURFACE, "rounded-2xl p-5")}>
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-xl" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="mt-4 h-5 w-40" />
            <Skeleton className="mt-2 h-4 w-24" />
          </section>
          <section className={cn(APP_PANEL_SURFACE, "rounded-2xl p-5")}>
            <Skeleton className="h-3 w-32" />
            <div className="mt-3 flex flex-wrap gap-2">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
          </section>
          <section className={cn(APP_PANEL_SURFACE, "rounded-2xl p-5")}>
            <Skeleton className="h-3 w-16" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
