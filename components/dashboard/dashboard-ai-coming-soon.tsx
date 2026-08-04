import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "@/lib/icons";
import { cn } from "@/lib/utils";

const AI_FEATURES = [
  "AI Reply",
  "AI Summary",
  "AI Lead Scoring",
  "AI Broadcast Recommendation",
] as const;

interface DashboardAiComingSoonProps {
  className?: string;
}

export function DashboardAiComingSoon({
  className,
}: DashboardAiComingSoonProps) {
  return (
    <DashboardWidget
      variant="glass"
      className={cn(
        "flex flex-col gap-2.5 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-3.5",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-sm">Coming Soon · AI</p>
          <p className="truncate text-muted-foreground text-xs">
            Assistive intelligence for engagement workflows
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {AI_FEATURES.map((label) => (
          <Badge
            key={label}
            variant="secondary"
            className="border-0 bg-black/[0.04] font-medium text-[11px] text-muted-foreground dark:bg-white/[0.06]"
          >
            {label}
          </Badge>
        ))}
      </div>
    </DashboardWidget>
  );
}
