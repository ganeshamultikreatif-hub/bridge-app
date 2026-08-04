import Link from "next/link";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import {
  AlertTriangle,
  type AppIcon,
  CalendarCheck,
  MessageIcon,
  Target,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

interface TodayTask {
  id: string;
  count: number;
  label: string;
  href: string;
  icon: AppIcon;
  tone: string;
}

const TASKS: TodayTask[] = [
  {
    id: "scheduled",
    count: 2,
    label: "Campaign Scheduled",
    href: "/broadcast",
    icon: CalendarCheck,
    tone: "bg-[#007AFF]/10 text-[#007AFF]",
  },
  {
    id: "leads",
    count: 15,
    label: "Lead Waiting",
    href: "/leads",
    icon: Target,
    tone: "bg-[#30D158]/12 text-emerald-700 dark:text-emerald-400",
  },
  {
    id: "failed",
    count: 3,
    label: "Failed Broadcast",
    href: "/broadcast",
    icon: AlertTriangle,
    tone: "bg-[#FF3B30]/10 text-[#FF3B30]",
  },
  {
    id: "replies",
    count: 8,
    label: "Customer Reply",
    href: "/inbox",
    icon: MessageIcon,
    tone: "bg-[#FF9500]/12 text-amber-700 dark:text-amber-400",
  },
];

interface DashboardTodaysTasksProps {
  className?: string;
}

export function DashboardTodaysTasks({ className }: DashboardTodaysTasksProps) {
  return (
    <DashboardWidget variant="glass" className={cn("p-3 sm:p-3.5", className)}>
      <div className="mb-3">
        <p className="font-semibold text-sm">Today&apos;s Tasks</p>
        <p className="text-muted-foreground text-xs">
          Priority work across campaigns, leads, and inbox
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {TASKS.map((task) => {
          const Icon = task.icon;
          return (
            <Link
              key={task.id}
              href={task.href}
              className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-black/[0.02] px-3 py-2.5 transition-colors hover:bg-black/[0.04] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  task.tone,
                )}
              >
                <Icon className="size-3.5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-sm tabular-nums leading-none">
                  {task.count}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                  {task.label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </DashboardWidget>
  );
}
