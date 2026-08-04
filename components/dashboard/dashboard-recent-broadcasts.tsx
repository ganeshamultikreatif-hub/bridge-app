import Link from "next/link";
import { DashboardScrollableBody } from "@/components/dashboard/dashboard-scrollable-body";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import {
  DASHBOARD_RECENT_LIST_MAX_HEIGHT,
  DASHBOARD_RECENT_WIDGET_HEIGHT,
} from "@/config/dashboard";
import { Megaphone } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { DashboardRecentBroadcast } from "@/types/dashboard";

interface DashboardRecentBroadcastsProps {
  items: DashboardRecentBroadcast[];
  className?: string;
}

const STATUS_LABEL: Record<DashboardRecentBroadcast["status"], string> = {
  sent: "Sent",
  scheduled: "Scheduled",
  failed: "Failed",
  sending: "Sending",
};

const STATUS_CLASS: Record<DashboardRecentBroadcast["status"], string> = {
  sent: "text-emerald-600 dark:text-emerald-400",
  scheduled: "text-[#007AFF]",
  failed: "text-[#FF3B30]",
  sending: "text-amber-600 dark:text-amber-400",
};

export function DashboardRecentBroadcasts({
  items,
  className,
}: DashboardRecentBroadcastsProps) {
  const isEmpty = items.length === 0;

  return (
    <DashboardWidget
      variant="glass"
      className={cn(DASHBOARD_RECENT_WIDGET_HEIGHT, "p-3 sm:p-3.5", className)}
    >
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm">Recent Broadcast</p>
          <p className="text-muted-foreground text-xs">
            {isEmpty ? "Latest sends" : `${items.length} recent campaigns`}
          </p>
        </div>
        <Megaphone className="size-4 text-foreground/50" aria-hidden="true" />
      </div>

      <DashboardScrollableBody
        className={cn("mt-3 pr-1", DASHBOARD_RECENT_LIST_MAX_HEIGHT)}
        empty={isEmpty}
      >
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <p className="font-medium text-sm">No broadcast yet</p>
            <p className="mt-1 max-w-xs text-muted-foreground text-xs leading-relaxed">
              Create a broadcast to see delivery progress here.
            </p>
            <Link
              href="/broadcast/new"
              className="mt-3 text-xs font-medium text-primary hover:underline"
            >
              Create Broadcast
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/broadcast/${item.id}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-black/4 dark:hover:bg-white/6"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{item.name}</p>
                    <p className="truncate text-muted-foreground text-xs">
                      {item.department} · {item.sentLabel}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={cn(
                        "text-[11px] font-medium",
                        STATUS_CLASS[item.status],
                      )}
                    >
                      {STATUS_LABEL[item.status]}
                    </p>
                    {item.status !== "scheduled" ? (
                      <p className="text-[10px] text-muted-foreground tabular-nums">
                        {item.deliveryRate.toFixed(1)}%
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </DashboardScrollableBody>
    </DashboardWidget>
  );
}
