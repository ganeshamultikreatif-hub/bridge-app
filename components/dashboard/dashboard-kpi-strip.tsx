import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import { cn } from "@/lib/utils";

export type DashboardKpiTone = "default" | "success" | "warning" | "danger";

export interface DashboardKpiStripItem {
  description?: string;
  label: string;
  tone?: DashboardKpiTone;
  value: string;
}

interface DashboardKpiStripProps {
  className?: string;
  items: DashboardKpiStripItem[];
}

const TONE_VALUE: Record<DashboardKpiTone, string> = {
  default: "text-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
};

/**
 * Mobile-only compact stats row — neutral glass, not tinted like quick actions.
 */
export function DashboardKpiStrip({
  className,
  items,
}: DashboardKpiStripProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <DashboardWidget variant="glass" className={cn("p-1 lg:hidden", className)}>
      <div
        className={cn(
          "grid divide-x divide-border/60",
          items.length === 2
            ? "grid-cols-2"
            : items.length === 3
              ? "grid-cols-3"
              : items.length === 6
                ? "grid-cols-3"
                : "grid-cols-4",
        )}
      >
        {items.map((item) => (
          <div
            className="flex min-w-0 flex-col items-center justify-center gap-0.5 px-1.5 py-2.5 text-center"
            key={item.label}
          >
            <p
              className={cn(
                "font-semibold text-lg tabular-nums tracking-tight leading-none",
                TONE_VALUE[item.tone ?? "default"],
              )}
            >
              {item.value}
            </p>
            <p className="truncate text-[10px] font-medium text-muted-foreground">
              {item.label}
            </p>
            {item.description ? (
              <p className="truncate text-[9px] text-muted-foreground/80">
                {item.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
}
