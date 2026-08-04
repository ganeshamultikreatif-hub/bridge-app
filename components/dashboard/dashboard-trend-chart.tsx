import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import { DASHBOARD_RECENT_WIDGET_HEIGHT } from "@/config/dashboard";
import type { AppIcon } from "@/lib/icons";
import { TrendingUp } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { DashboardTrendPoint } from "@/types/dashboard";

interface DashboardTrendChartProps {
  title: string;
  description: string;
  points: DashboardTrendPoint[];
  color?: string;
  icon?: AppIcon;
  className?: string;
}

function buildPolyline(points: DashboardTrendPoint[]): string {
  if (points.length === 0) {
    return "";
  }

  const max = Math.max(...points.map((point) => point.value), 1);
  const width = 100;
  const height = 36;
  const step = points.length > 1 ? width / (points.length - 1) : width;

  return points
    .map((point, index) => {
      const x = index * step;
      const y = height - (point.value / max) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
}

function buildAreaPath(points: DashboardTrendPoint[]): string {
  if (points.length === 0) {
    return "";
  }

  const max = Math.max(...points.map((point) => point.value), 1);
  const width = 100;
  const height = 36;
  const step = points.length > 1 ? width / (points.length - 1) : width;

  const coords = points.map((point, index) => {
    const x = index * step;
    const y = height - (point.value / max) * (height - 4) - 2;
    return { x, y };
  });

  const line = coords.map((point) => `${point.x},${point.y}`).join(" L");
  return `M0,${height} L${line} L${width},${height} Z`;
}

export function DashboardTrendChart({
  title,
  description,
  points,
  color = "#007AFF",
  icon: Icon = TrendingUp,
  className,
}: DashboardTrendChartProps) {
  const total = points.reduce((sum, point) => sum + point.value, 0);
  const polyline = buildPolyline(points);
  const area = buildAreaPath(points);
  const isEmpty = points.length === 0;

  return (
    <DashboardWidget
      variant="glass"
      className={cn(
        DASHBOARD_RECENT_WIDGET_HEIGHT,
        "justify-between p-3 sm:p-3.5",
        className,
      )}
    >
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
        <Icon className="size-4 text-foreground/50" aria-hidden="true" />
      </div>

      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <p className="font-medium text-sm">No trend data</p>
          <p className="mt-1 text-muted-foreground text-xs">
            Data will appear after activity starts.
          </p>
        </div>
      ) : (
        <div className="mt-3 flex min-h-0 flex-1 flex-col justify-between gap-3">
          <div className="flex items-end justify-between gap-3">
            <p className="font-semibold text-2xl tabular-nums tracking-tight">
              {total}
            </p>
            <p className="pb-1 text-[11px] text-muted-foreground">6 weeks</p>
          </div>

          <svg
            viewBox="0 0 100 36"
            className="h-16 w-full"
            role="img"
            aria-label={`${title} chart`}
          >
            <title>{title}</title>
            <path d={area} fill={color} opacity="0.16" />
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polyline}
            />
          </svg>

          <div className="flex justify-between gap-1">
            {points.map((point) => (
              <span
                key={point.label}
                className="min-w-0 flex-1 truncate text-center text-[10px] text-muted-foreground"
              >
                {point.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </DashboardWidget>
  );
}
