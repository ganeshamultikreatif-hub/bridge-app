import Link from "next/link";
import { DashboardScrollableBody } from "@/components/dashboard/dashboard-scrollable-body";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import {
  DASHBOARD_RECENT_LIST_MAX_HEIGHT,
  DASHBOARD_RECENT_WIDGET_HEIGHT,
} from "@/config/dashboard";
import { Target } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { DashboardRecentLead } from "@/types/dashboard";

interface DashboardRecentLeadsProps {
  items: DashboardRecentLead[];
  className?: string;
}

const STATUS_LABEL: Record<DashboardRecentLead["status"], string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

const STATUS_CLASS: Record<DashboardRecentLead["status"], string> = {
  new: "text-[#007AFF]",
  contacted: "text-amber-600 dark:text-amber-400",
  qualified: "text-violet-600 dark:text-violet-400",
  won: "text-emerald-600 dark:text-emerald-400",
  lost: "text-[#FF3B30]",
};

export function DashboardRecentLeads({
  items,
  className,
}: DashboardRecentLeadsProps) {
  const isEmpty = items.length === 0;

  return (
    <DashboardWidget
      variant="solid"
      className={cn(DASHBOARD_RECENT_WIDGET_HEIGHT, "p-3 sm:p-3.5", className)}
    >
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm">Recent Lead</p>
          <p className="text-muted-foreground text-xs">
            {isEmpty ? "Incoming leads" : `${items.length} latest leads`}
          </p>
        </div>
        <Target className="size-4 text-foreground/50" aria-hidden="true" />
      </div>

      <DashboardScrollableBody
        className={cn("mt-3 pr-1", DASHBOARD_RECENT_LIST_MAX_HEIGHT)}
        empty={isEmpty}
      >
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <p className="font-medium text-sm">No leads yet</p>
            <p className="mt-1 max-w-xs text-muted-foreground text-xs leading-relaxed">
              Leads from broadcasts and inbox will appear here.
            </p>
            <Link
              href="/leads"
              className="mt-3 text-xs font-medium text-primary hover:underline"
            >
              Open lead pipeline
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/customers/${item.id}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-black/4 dark:hover:bg-white/6"
                >
                  <span
                    aria-hidden
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/5 text-[11px] font-semibold text-foreground/70 dark:bg-white/8"
                  >
                    {item.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{item.name}</p>
                    <p className="truncate text-muted-foreground text-xs">
                      {item.company ? `${item.company} · ` : ""}
                      {item.department} · {item.sales}
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
                    <p className="text-[10px] text-muted-foreground">
                      {item.timeLabel}
                    </p>
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
