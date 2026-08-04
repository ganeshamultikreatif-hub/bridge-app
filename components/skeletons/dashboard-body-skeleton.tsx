import { Skeleton } from "@/components/ui/skeleton";
import {
  DASHBOARD_WIDGET_GAP,
  DASHBOARD_WIDGET_INSET,
  DASHBOARD_WIDGET_RADIUS,
} from "@/config/dashboard";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { cn } from "@/lib/utils";

/** Dashboard widgets only — greeting shell can paint with the route instantly. */
export function DashboardBodySkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Memuat dashboard"
      className={cn("flex min-h-0 flex-1 flex-col", DASHBOARD_WIDGET_INSET)}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="hidden h-9 w-36 rounded-full sm:block" />
      </div>

      <div
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
          DASHBOARD_WIDGET_GAP,
        )}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className={cn(
              APP_PANEL_SURFACE,
              DASHBOARD_WIDGET_RADIUS,
              "space-y-2 p-3.5",
            )}
          >
            <Skeleton className="size-8 rounded-xl" />
            <Skeleton className="h-7 w-14" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      <div
        className={cn(
          "mt-2.5 grid gap-2.5 lg:grid-cols-2",
          DASHBOARD_WIDGET_GAP,
        )}
      >
        <div
          className={cn(
            APP_PANEL_SURFACE,
            DASHBOARD_WIDGET_RADIUS,
            "space-y-3 p-4",
          )}
        >
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
        <div
          className={cn(
            APP_PANEL_SURFACE,
            DASHBOARD_WIDGET_RADIUS,
            "space-y-3 p-4",
          )}
        >
          <Skeleton className="h-5 w-36" />
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </div>

      <div
        className={cn(
          "mt-2.5 grid gap-2.5 lg:grid-cols-2",
          DASHBOARD_WIDGET_GAP,
        )}
      >
        <div
          className={cn(
            APP_PANEL_SURFACE,
            DASHBOARD_WIDGET_RADIUS,
            "space-y-3 p-4",
          )}
        >
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div
          className={cn(
            APP_PANEL_SURFACE,
            DASHBOARD_WIDGET_RADIUS,
            "space-y-3 p-4",
          )}
        >
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
