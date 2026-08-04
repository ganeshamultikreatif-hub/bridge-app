import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import { DASHBOARD_BENTO_TILE_HEIGHT } from "@/config/dashboard";
import { type AppIcon, CheckCircle2, Layers, Target, Users } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { CustomerSummary } from "@/types/customer";

interface CustomersSummaryProps {
  summary: CustomerSummary;
  className?: string;
}

const CARDS: Array<{
  key: keyof CustomerSummary;
  label: string;
  description: string;
  icon: AppIcon;
  variant: "tinted" | "tintedSuccess" | "tintedWarning" | "solid";
}> = [
  {
    key: "total",
    label: "Customer",
    description: "PIC digabung by WA",
    icon: Users,
    variant: "tinted",
  },
  {
    key: "withSales",
    label: "Punya sales owner",
    description: "Sudah di-assign tim",
    icon: CheckCircle2,
    variant: "tintedSuccess",
  },
  {
    key: "multiProduct",
    label: "Multi-produk",
    description: "Lebih dari 1 sales/produk",
    icon: Layers,
    variant: "solid",
  },
  {
    key: "hotLeads",
    label: "Hot Leads",
    description: "Customer prioritas",
    icon: Target,
    variant: "tintedWarning",
  },
];

export function CustomersSummary({
  summary,
  className,
}: CustomersSummaryProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2.5 lg:grid-cols-4", className)}>
      {CARDS.map((card) => {
        const Icon = card.icon;
        const isTinted = card.variant.startsWith("tinted");

        return (
          <DashboardWidget
            key={card.key}
            variant={card.variant}
            className={cn(DASHBOARD_BENTO_TILE_HEIGHT, "justify-between p-3.5")}
          >
            <div className="flex items-start justify-between gap-2">
              <p
                className={cn(
                  "font-semibold text-[10px] uppercase tracking-wide",
                  isTinted ? "text-white/85" : "text-muted-foreground",
                )}
              >
                {card.label}
              </p>
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  isTinted ? "text-white/95" : "text-foreground/55",
                )}
                aria-hidden
              />
            </div>
            <div>
              <p
                className={cn(
                  "font-semibold text-2xl tabular-nums tracking-tight sm:text-3xl",
                  isTinted ? "text-white" : "text-foreground",
                )}
              >
                {summary[card.key]}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-[11px]",
                  isTinted ? "text-white/80" : "text-muted-foreground",
                )}
              >
                {card.description}
              </p>
            </div>
          </DashboardWidget>
        );
      })}
    </div>
  );
}
