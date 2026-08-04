import { Skeleton } from "@/components/ui/skeleton";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { cn } from "@/lib/utils";

/** Create / edit schedule form body — title chrome can stay outside Suspense. */
export function FormBodySkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Memuat formulir"
      className="mx-auto w-full flex-1 space-y-6"
    >
      <div className="flex items-start gap-3">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56 max-w-full" />
        </div>
      </div>

      <div className="grid min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section className={cn(APP_PANEL_SURFACE, "space-y-4 rounded-2xl p-5")}>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </section>

        <section
          className={cn(
            APP_PANEL_SURFACE,
            "hidden space-y-3 rounded-2xl p-5 lg:block",
          )}
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </section>
      </div>
    </div>
  );
}
