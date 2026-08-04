import { Skeleton } from "@/components/ui/skeleton";
import type { ReportsTab } from "@/config/reports";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { cn } from "@/lib/utils";

function Line({ className }: { className?: string }) {
  return <Skeleton className={cn("h-3.5 rounded-md", className)} />;
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(APP_PANEL_SURFACE, "rounded-2xl p-4", className)}>
      {children}
    </div>
  );
}

function MonthlyTabSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6">
      <Line className="h-3 w-48 md:w-80" />
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Panel key={index} className="space-y-3 p-3.5">
            <Skeleton className="size-8 rounded-xl" />
            <Skeleton className="h-7 w-14" />
            <Line className="w-20" />
            <Line className="w-24" />
          </Panel>
        ))}
      </div>
      <Panel className="space-y-4">
        <Line className="h-4 w-40" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </Panel>
    </div>
  );
}

function TeamTabSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6">
      <Line className="h-3 w-56 md:w-96" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Panel key={index} className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Line className="w-28" />
                <Line className="w-20" />
              </div>
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex gap-2">
              <Line className="w-12" />
              <Line className="w-12" />
              <Line className="w-12" />
            </div>
          </Panel>
        ))}
      </div>
      <Panel className="space-y-3">
        <Line className="h-4 w-36" />
        <Skeleton className="h-3 w-full rounded-full" />
        <div className="flex justify-between gap-3">
          <Line className="w-16" />
          <Line className="w-16" />
          <Line className="w-16" />
        </div>
      </Panel>
      <Panel className="space-y-3 overflow-hidden p-0">
        <div className="space-y-0 p-2">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border-b border-border/50 px-3 py-3 last:border-0"
            >
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <Line className="w-28" />
              <Line className="ml-auto w-12" />
              <Line className="w-12" />
              <Line className="hidden w-12 sm:block" />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function BrandTabSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6">
      <Line className="h-3 w-52 md:w-80" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Panel key={index} className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <Line className="w-32" />
                <Line className="w-20" />
              </div>
            </div>
            {Array.from({ length: 3 }, (_, row) => (
              <div key={row} className="space-y-2">
                <div className="flex justify-between gap-2">
                  <Line className="w-24" />
                  <Line className="w-10" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </Panel>
        ))}
      </div>
    </div>
  );
}

function AdsTabSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6">
      <Line className="h-3 w-60 md:w-96" />
      <div className="flex justify-between gap-3">
        <Line className="w-28" />
        <Line className="w-40" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Panel key={index} className="flex items-center gap-3 rounded-xl p-3">
            <Skeleton className="size-10 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Line className="w-3/4 max-w-56" />
              <Line className="w-32" />
            </div>
            <Skeleton className="h-8 w-14 shrink-0 rounded-full" />
            <Skeleton className="h-8 w-16 shrink-0 rounded-full" />
          </Panel>
        ))}
      </div>
    </div>
  );
}

interface ReportsTabSkeletonProps {
  tab: ReportsTab;
}

/** Matches each reports tab layout while the chunk / data paints. */
export function ReportsTabSkeleton({ tab }: ReportsTabSkeletonProps) {
  switch (tab) {
    case "leads":
      return <MonthlyTabSkeleton />;
    case "sales":
      return <BrandTabSkeleton />;
    case "delivery":
      return <AdsTabSkeleton />;
    case "broadcast":
    default:
      return <TeamTabSkeleton />;
  }
}
