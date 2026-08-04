import { Skeleton } from "@/components/ui/skeleton";

/** Compact filter/action placeholders for the header actions slot. */
export function HeaderToolbarSkeleton() {
  return (
    <div className="flex shrink-0 flex-wrap justify-end gap-2">
      <Skeleton className="h-9 w-28 rounded-full" />
      <Skeleton className="h-9 w-24 rounded-full" />
      <Skeleton className="h-9 w-32 rounded-full" />
    </div>
  );
}
