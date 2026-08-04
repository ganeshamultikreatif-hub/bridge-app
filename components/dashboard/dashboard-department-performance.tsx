import { DashboardScrollableBody } from "@/components/dashboard/dashboard-scrollable-body";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import {
  DASHBOARD_RECENT_LIST_MAX_HEIGHT,
  DASHBOARD_RECENT_WIDGET_HEIGHT,
} from "@/config/dashboard";
import { Building2Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { DashboardDepartmentStat } from "@/types/dashboard";

interface DashboardDepartmentPerformanceProps {
  items: DashboardDepartmentStat[];
  className?: string;
}

export function DashboardDepartmentPerformance({
  items,
  className,
}: DashboardDepartmentPerformanceProps) {
  const isEmpty = items.length === 0;
  const maxBroadcasts = Math.max(...items.map((item) => item.broadcasts), 1);

  return (
    <DashboardWidget
      variant="solid"
      className={cn(DASHBOARD_RECENT_WIDGET_HEIGHT, "p-3 sm:p-3.5", className)}
    >
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm">Department Performance</p>
          <p className="text-muted-foreground text-xs">
            Broadcasts, leads, conversion
          </p>
        </div>
        <Building2Icon
          className="size-4 text-foreground/50"
          aria-hidden="true"
        />
      </div>

      <DashboardScrollableBody
        className={cn("mt-3 pr-1", DASHBOARD_RECENT_LIST_MAX_HEIGHT)}
        empty={isEmpty}
      >
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <p className="font-medium text-sm">No departments yet</p>
            <p className="mt-1 max-w-xs text-muted-foreground text-xs leading-relaxed">
              Create a department to start tracking performance.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item) => {
              const width = (item.broadcasts / maxBroadcasts) * 100;

              return (
                <li key={item.id} className="rounded-xl px-2 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm">
                        {item.name}
                      </p>
                      <p className="truncate text-muted-foreground text-xs">
                        {item.broadcasts} broadcasts · {item.leads} leads
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold text-sm tabular-nums">
                      {item.conversionRate}%
                    </p>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/8 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#007AFF]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </DashboardScrollableBody>
    </DashboardWidget>
  );
}
