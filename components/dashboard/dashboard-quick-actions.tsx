import Link from "next/link";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import {
  DASHBOARD_QUICK_ACTIONS,
  type DashboardQuickAction,
} from "@/config/dashboard";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface DashboardQuickActionsProps {
  className?: string;
  /** Override href for a given action id (e.g. brand-filtered scheduler). */
  hrefOverrides?: Partial<Record<string, string>>;
  actions?: DashboardQuickAction[];
}

export function DashboardQuickActions({
  className,
  hrefOverrides,
  actions = DASHBOARD_QUICK_ACTIONS,
}: DashboardQuickActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  const columns =
    actions.length <= 2
      ? "grid-cols-2"
      : actions.length === 3
        ? "grid-cols-3"
        : actions.length === 4
          ? "grid-cols-2 sm:grid-cols-4"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";

  return (
    <DashboardWidget variant="glass" className={cn("p-2", className)}>
      <div className={cn("grid gap-2", columns)}>
        {actions.map((action) => {
          const Icon = action.icon;
          const href = hrefOverrides?.[action.id] ?? action.href;

          return (
            <Link
              key={action.id}
              href={href}
              className={cn(
                RADIUS_DEEP,
                action.surface,
                "flex min-h-17 flex-col justify-between p-2.5 transition-transform duration-200",
                "hover:scale-[1.02] active:scale-[0.98] sm:min-h-19",
              )}
            >
              <Icon
                className="size-4 shrink-0 text-white drop-shadow-sm"
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block font-semibold text-xs leading-snug text-white">
                  {action.label}
                </span>
                <span className="mt-0.5 block truncate text-[10px] text-white/80">
                  {action.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </DashboardWidget>
  );
}
