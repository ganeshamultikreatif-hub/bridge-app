import { Skeleton } from "@/components/ui/skeleton";

/** Full reports chrome — filters + type strip + table body. */
export function ReportsBodySkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading reports"
      className="flex min-w-0 flex-1 flex-col gap-3 md:gap-5"
    >
      <div className="flex flex-col gap-2 rounded-[var(--radius-outer)] border border-border/50 p-2">
        <div className="flex w-full gap-1 rounded-full bg-muted/50 p-1">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-9 min-w-0 flex-1 rounded-full" />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-40 rounded-full" />
          <Skeleton className="h-9 w-36 rounded-full" />
          <Skeleton className="h-9 w-44 rounded-full" />
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-outer)] border border-border/50">
        <div className="space-y-2 border-b border-border/60 px-5 py-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="space-y-3 p-5">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
