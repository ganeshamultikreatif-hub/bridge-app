"use client";

import Link from "next/link";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { listBroadcasts } from "@/lib/broadcast/data";
import { CalendarDays, Plus } from "@/lib/icons";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Mock August 2026 calendar — campaign dots on selected days. */
const CAMPAIGN_DAYS: Record<number, { name: string; status: string }[]> = {
  4: [{ name: "Promo April residual", status: "completed" }],
  11: [{ name: "Enterprise outreach", status: "scheduled" }],
  12: [{ name: "CS onboarding wave", status: "running" }],
  18: [{ name: "SMB nurture", status: "scheduled" }],
  25: [{ name: "Renewal reminder", status: "draft" }],
};

export function CampaignCalendarView() {
  const daysInMonth = 31;
  const startOffset = 4; // Aug 2026 starts Saturday-ish — use Mon-first offset 4 for demo
  const cells: Array<number | null> = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const campaigns = listBroadcasts().slice(0, 5);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 text-muted-foreground" />
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Campaign calendar
            </h2>
            <p className="text-xs text-muted-foreground">
              August 2026 · Bridge
            </p>
          </div>
        </div>
        <Button asChild size="sm">
          <Link href="/broadcast/new">
            <Plus data-icon="inline-start" />
            Create Broadcast
          </Link>
        </Button>
      </div>

      <SolidSurface className={cn(APP_PANEL_SURFACE, "p-3 sm:p-4")}>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((day, index) => {
            if (day == null) {
              const row = Math.floor(index / 7);
              const col = index % 7;
              return (
                <div
                  key={`pad-r${row}-c${col}`}
                  className="min-h-16 rounded-lg"
                />
              );
            }
            const items = CAMPAIGN_DAYS[day] ?? [];
            return (
              <div
                key={day}
                className={cn(
                  "min-h-16 rounded-lg border border-border/50 bg-muted/20 p-1.5 text-left",
                  items.length > 0 && "border-primary/30 bg-primary/5",
                )}
              >
                <p className="text-xs font-semibold tabular-nums">{day}</p>
                <div className="mt-1 space-y-0.5">
                  {items.map((item) => (
                    <p
                      key={item.name}
                      className="truncate text-[10px] leading-tight text-foreground"
                    >
                      {item.name}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SolidSurface>

      <SolidSurface
        className={cn(APP_PANEL_SURFACE, "divide-y divide-border/50 p-0")}
      >
        {campaigns.map((c) => (
          <Link
            key={c.id}
            href={`/broadcast/${c.id}`}
            className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-muted/40"
          >
            <span className="font-medium">{c.name}</span>
            <Badge variant="secondary">{c.status}</Badge>
          </Link>
        ))}
      </SolidSurface>
    </div>
  );
}
