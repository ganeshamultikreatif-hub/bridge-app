import { DashboardScrollableBody } from "@/components/dashboard/dashboard-scrollable-body";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import {
  DASHBOARD_RECENT_LIST_MAX_HEIGHT,
  DASHBOARD_RECENT_WIDGET_HEIGHT,
} from "@/config/dashboard";
import { ClockIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { CustomerTimelineItem } from "@/types/customer";

const TONE_DOT: Record<NonNullable<CustomerTimelineItem["tone"]>, string> = {
  default: "bg-[#007AFF]",
  success: "bg-[#30D158]",
  warning: "bg-[#FF9500]",
  danger: "bg-[#FF3B30]",
};

interface CustomerTimelineProps {
  items: CustomerTimelineItem[];
  className?: string;
  /** Flatten chrome when nested inside Attio-style tabs. */
  embedded?: boolean;
}

export function CustomerTimeline({
  items,
  className,
  embedded = false,
}: CustomerTimelineProps) {
  const isEmpty = items.length === 0;

  const body = (
    <>
      {!embedded ? (
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-sm">Timeline</p>
            <p className="text-xs text-muted-foreground">Activity history</p>
          </div>
          <ClockIcon className="size-4 text-foreground/50" aria-hidden />
        </div>
      ) : null}

      <DashboardScrollableBody
        className={cn(
          embedded
            ? "pr-1 max-h-[28rem]"
            : cn("mt-3 pr-1", DASHBOARD_RECENT_LIST_MAX_HEIGHT),
        )}
        empty={isEmpty}
      >
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <p className="font-medium text-sm">No activity yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Campaigns, replies, and notes will appear here.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <div className="flex items-start gap-3 rounded-xl px-2 py-2">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      TONE_DOT[item.tone ?? "default"],
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <time className="shrink-0 text-[11px] text-muted-foreground">
                    {item.timeLabel}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DashboardScrollableBody>
    </>
  );

  if (embedded) {
    return <div className={cn("min-h-[12rem]", className)}>{body}</div>;
  }

  return (
    <DashboardWidget
      variant="glass"
      className={cn(DASHBOARD_RECENT_WIDGET_HEIGHT, "p-3.5", className)}
    >
      {body}
    </DashboardWidget>
  );
}
