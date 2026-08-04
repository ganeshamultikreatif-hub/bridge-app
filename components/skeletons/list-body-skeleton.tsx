import { Skeleton } from "@/components/ui/skeleton";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { cn } from "@/lib/utils";

interface ListBodySkeletonProps {
  rows?: number;
  withSidebar?: boolean;
}

/**
 * Generic list/table body — media, notifications, settings tables.
 * Title/tabs stay in page chrome so navigation does not flash full-page.
 */
export function ListBodySkeleton({
  rows = 8,
  withSidebar = false,
}: ListBodySkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Memuat daftar"
      className={cn(
        "grid min-h-0 flex-1 gap-4",
        withSidebar && "xl:grid-cols-[minmax(0,1fr)_22rem]",
      )}
    >
      <section className={cn(APP_PANEL_SURFACE, "overflow-hidden rounded-2xl")}>
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: rows }, (_, index) => (
            <div key={index} className="flex items-center gap-3 px-4 py-3.5">
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="hidden h-5 w-16 sm:block" />
              <Skeleton className="hidden h-5 w-14 md:block" />
            </div>
          ))}
        </div>
      </section>

      {withSidebar ? (
        <section
          className={cn(
            APP_PANEL_SURFACE,
            "hidden space-y-4 rounded-2xl p-4 xl:block",
          )}
        >
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </section>
      ) : null}
    </div>
  );
}
