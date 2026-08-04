import { DASHBOARD_WIDGET_RADIUS } from "@/config/dashboard";
import { GLASS_SURFACE } from "@/config/glass";
import { cn } from "@/lib/utils";

export type DashboardWidgetVariant =
  | "glass"
  | "solid"
  | "tinted"
  | "tintedSuccess"
  | "tintedWarning"
  | "tintedDanger";

interface DashboardWidgetProps {
  children: React.ReactNode;
  variant?: DashboardWidgetVariant;
  className?: string;
}

function tintedSurface(from: string, to: string, glowRgb: string) {
  return cn(
    "border-0 bg-linear-to-br text-white",
    from,
    to,
    `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),2px_4px_12px_-2px_rgb(${glowRgb}/0.22)]`,
  );
}

/** Drop shadows biased bottom-right — avoids left bleed into the sidebar gap. */
const WIDGET_VARIANTS: Record<DashboardWidgetVariant, string> = {
  glass: cn(
    GLASS_SURFACE,
    "text-card-foreground shadow-[2px_4px_12px_-2px_rgb(0_0_0/0.08)] dark:shadow-[2px_5px_14px_-2px_rgb(0_0_0/0.28)]",
  ),
  solid: cn(
    "border-0 bg-linear-to-br from-[#FFFFFF] via-[#F2F2F7] to-[#D8D8DE] text-foreground",
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),inset_0_-1px_0_0_rgba(0,0,0,0.04),2px_4px_12px_-2px_rgb(0_0_0/0.1)]",
    "dark:from-[#3A3A3C] dark:via-[#2C2C2E] dark:to-[#1C1C1E] dark:text-white",
    "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),inset_0_-1px_0_0_rgba(0,0,0,0.45),2px_5px_14px_-2px_rgb(0_0_0/0.36)]",
  ),
  /** Blue — Total */
  tinted: cn(
    tintedSurface("from-[#5AC8FA]", "to-[#007AFF]", "0_122_255"),
    "dark:from-[#4AB0E0] dark:to-[#0066D6]",
  ),
  /** Green — Completion */
  tintedSuccess: cn(
    tintedSurface("from-[#64E286]", "to-[#30D158]", "48_209_88"),
    "dark:from-[#4EC86F] dark:to-[#248A3D]",
  ),
  /** Orange — Backlog */
  tintedWarning: cn(
    tintedSurface("from-[#FFB340]", "to-[#FF9500]", "255_149_0"),
    "dark:from-[#E09600] dark:to-[#C93400]",
  ),
  /** Red — Terlambat */
  tintedDanger: cn(
    tintedSurface("from-[#FF6961]", "to-[#FF3B30]", "255_59_48"),
    "dark:from-[#E04840] dark:to-[#D70015]",
  ),
};

export function isDashboardTintedVariant(
  variant: DashboardWidgetVariant,
): boolean {
  return (
    variant === "tinted" ||
    variant === "tintedSuccess" ||
    variant === "tintedWarning" ||
    variant === "tintedDanger"
  );
}

export function DashboardWidget({
  children,
  variant = "glass",
  className,
}: DashboardWidgetProps) {
  return (
    <div
      className={cn(
        DASHBOARD_WIDGET_RADIUS,
        "flex min-h-0 min-w-0 flex-col overflow-hidden",
        WIDGET_VARIANTS[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
