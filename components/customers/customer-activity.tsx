import { SolidSurface } from "@/components/shared/solid-surface";
import { Megaphone, MessageIcon, Target } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type {
  CustomerBroadcastItem,
  CustomerTimelineItem,
} from "@/types/customer";

export interface CustomerActivityItem {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  kind: "reply" | "broadcast" | "lead" | "system";
  tone?: "default" | "success" | "warning" | "danger";
}

const KIND_ICON = {
  reply: MessageIcon,
  broadcast: Megaphone,
  lead: Target,
  system: Target,
} as const;

const TONE_DOT: Record<NonNullable<CustomerActivityItem["tone"]>, string> = {
  default: "bg-[#007AFF]",
  success: "bg-[#30D158]",
  warning: "bg-[#FF9500]",
  danger: "bg-[#FF3B30]",
};

interface CustomerActivityProps {
  items: CustomerActivityItem[];
  className?: string;
}

/** Derive engagement-focused activity from timeline + broadcast history. */
export function buildCustomerActivity(
  timeline: CustomerTimelineItem[],
  broadcasts: CustomerBroadcastItem[],
): CustomerActivityItem[] {
  const fromTimeline: CustomerActivityItem[] = timeline.map((item) => {
    const lower = `${item.title} ${item.description}`.toLowerCase();
    const kind: CustomerActivityItem["kind"] = lower.includes("repl")
      ? "reply"
      : lower.includes("lead")
        ? "lead"
        : lower.includes("broadcast") || lower.includes("campaign")
          ? "broadcast"
          : "system";
    return {
      id: `act_${item.id}`,
      title: item.title,
      description: item.description,
      timeLabel: item.timeLabel,
      kind,
      tone: item.tone,
    };
  });

  const fromBroadcasts: CustomerActivityItem[] = broadcasts.map((item) => ({
    id: `act_bc_${item.id}`,
    title:
      item.status === "failed"
        ? `Broadcast failed · ${item.name}`
        : item.status === "scheduled"
          ? `Campaign scheduled · ${item.name}`
          : `Campaign delivered · ${item.name}`,
    description: `${item.sentLabel} · ${item.deliveryRate}% delivery`,
    timeLabel: item.sentLabel,
    kind: "broadcast" as const,
    tone:
      item.status === "failed"
        ? ("danger" as const)
        : item.status === "scheduled"
          ? ("default" as const)
          : ("success" as const),
  }));

  return [...fromTimeline, ...fromBroadcasts].slice(0, 12);
}

export function CustomerActivity({ items, className }: CustomerActivityProps) {
  const isEmpty = items.length === 0;

  return (
    <SolidSurface className={cn("p-4 sm:p-5", className)}>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="font-medium text-sm">No activity yet</p>
          <p className="mt-1 max-w-sm text-muted-foreground text-xs">
            Replies, campaign deliveries, and lead updates will show here.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = KIND_ICON[item.kind];
            return (
              <li key={item.id}>
                <div className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
                  <span
                    className={cn(
                      "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] dark:bg-white/[0.06]",
                    )}
                  >
                    <Icon className="size-3.5 text-foreground/60" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <span
                        aria-hidden
                        className={cn(
                          "mt-1.5 size-1.5 shrink-0 rounded-full",
                          TONE_DOT[item.tone ?? "default"],
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm leading-snug">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-muted-foreground text-xs">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <time className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                    {item.timeLabel}
                  </time>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SolidSurface>
  );
}
