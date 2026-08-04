import { DashboardScrollableBody } from "@/components/dashboard/dashboard-scrollable-body";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import {
  DASHBOARD_RECENT_LIST_MAX_HEIGHT,
  DASHBOARD_RECENT_WIDGET_HEIGHT,
} from "@/config/dashboard";
import { ClockIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { DashboardActivityItem } from "@/types/dashboard";

interface DashboardActivityProps {
  items: DashboardActivityItem[];
  className?: string;
}

const TONE_DOT: Record<NonNullable<DashboardActivityItem["tone"]>, string> = {
  default: "bg-[#007AFF]",
  success: "bg-[#30D158]",
  warning: "bg-[#FF9500]",
  danger: "bg-[#FF3B30]",
};

export function DashboardActivity({
  items,
  className,
}: DashboardActivityProps) {
  const isEmpty = items.length === 0;

  return (
    <DashboardWidget
      variant="glass"
      className={cn(DASHBOARD_RECENT_WIDGET_HEIGHT, "p-3 sm:p-3.5", className)}
    >
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm">Live Activity Feed</p>
          <p className="text-muted-foreground text-xs">
            Real-time engagement events
          </p>
        </div>
        <ClockIcon className="size-4 text-foreground/50" aria-hidden="true" />
      </div>

      <DashboardScrollableBody
        className={cn("mt-3 pr-1", DASHBOARD_RECENT_LIST_MAX_HEIGHT)}
        empty={isEmpty}
      >
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <p className="font-medium text-sm">No activity yet</p>
            <p className="mt-1 max-w-xs text-muted-foreground text-xs leading-relaxed">
              Campaigns, leads, and customer replies will appear here.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <div className="flex items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-black/4 dark:hover:bg-white/6">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      TONE_DOT[item.tone ?? "default"],
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{item.title}</p>
                    <p className="truncate text-muted-foreground text-xs">
                      {item.description}
                    </p>
                  </div>
                  <time className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                    {item.timeLabel}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DashboardScrollableBody>
    </DashboardWidget>
  );
}
