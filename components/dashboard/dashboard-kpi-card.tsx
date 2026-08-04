import {
  DashboardWidget,
  type DashboardWidgetVariant,
  isDashboardTintedVariant,
} from "@/components/dashboard/dashboard-widget";
import { DASHBOARD_BENTO_TILE_HEIGHT } from "@/config/dashboard";
import type { AppIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface DashboardKpiCardProps {
  description?: string;
  icon: AppIcon;
  label: string;
  value: string;
  variant?: DashboardWidgetVariant;
  className?: string;
}

export function DashboardKpiCard({
  description,
  icon: Icon,
  label,
  value,
  variant = "glass",
  className,
}: DashboardKpiCardProps) {
  const isTinted = isDashboardTintedVariant(variant);

  return (
    <DashboardWidget
      variant={variant}
      className={cn(
        DASHBOARD_BENTO_TILE_HEIGHT,
        "justify-between p-3 sm:p-3.5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={cn(
            "font-semibold text-[10px] uppercase tracking-wide",
            isTinted ? "text-white/85" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        <Icon
          className={cn(
            "size-4 shrink-0",
            isTinted ? "text-white/95" : "text-foreground/55",
          )}
          aria-hidden="true"
        />
      </div>
      <div>
        <p
          className={cn(
            "font-semibold text-2xl tabular-nums tracking-tight sm:text-3xl",
            isTinted ? "text-white" : "text-foreground",
          )}
        >
          {value}
        </p>
        {description ? (
          <p
            className={cn(
              "mt-0.5 truncate text-[11px] leading-snug",
              isTinted ? "text-white/80" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </DashboardWidget>
  );
}
