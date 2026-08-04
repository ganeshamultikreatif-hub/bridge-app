import { type AppIcon, CheckCircle2, GearSixIcon, Sparkles } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { ChangelogItem, ChangelogItemKind } from "@/types/changelog";

const KIND_META: Record<
  ChangelogItemKind,
  { icon: AppIcon; label: string; tone: string }
> = {
  feature: {
    icon: Sparkles,
    label: "Baru",
    tone: "bg-primary/12 text-primary",
  },
  improvement: {
    icon: CheckCircle2,
    label: "Peningkatan",
    tone: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  },
  fix: {
    icon: GearSixIcon,
    label: "Perbaikan",
    tone: "bg-amber-500/12 text-amber-700 dark:text-amber-400",
  },
};

interface ChangelogItemRowProps {
  item: ChangelogItem;
}

export function ChangelogItemRow({ item }: ChangelogItemRowProps) {
  const meta = KIND_META[item.kind];
  const Icon = meta.icon;

  return (
    <li className="flex gap-3 rounded-2xl border border-border/80 bg-card/60 px-3.5 py-3">
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl",
          meta.tone,
        )}
      >
        <Icon aria-hidden="true" className="size-3.5" />
      </span>
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{item.title}</p>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium leading-none",
              meta.tone,
            )}
          >
            {meta.label}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </li>
  );
}
