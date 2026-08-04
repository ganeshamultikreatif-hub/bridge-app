"use client";

import { useEffect, useState } from "react";
import { DashboardDigitalClock } from "@/components/dashboard/dashboard-digital-clock";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import { getTimeGreeting } from "@/lib/user/greeting";

interface DashboardGreetingProps {
  username: string;
  rangeLabel: string;
}

export function DashboardGreeting({
  username,
  rangeLabel,
}: DashboardGreetingProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const greeting = `${now ? getTimeGreeting(now) : "Halo"}, ${username}`;
  const dateLabel = now
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "numeric",
      }).format(now)
    : "Today";

  return (
    <DashboardWidget
      variant="glass"
      className="w-full flex-row items-center justify-between gap-3 px-3.5 py-2.5 sm:px-4"
    >
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="truncate font-medium text-muted-foreground text-xs leading-snug">
          <span>{dateLabel}</span>
          <span className="mx-1.5 text-muted-foreground/50">·</span>
          <span>{rangeLabel}</span>
        </p>
        <h1 className="mt-0.5 truncate font-semibold text-xl leading-tight tracking-tight text-foreground sm:text-2xl">
          {greeting}
        </h1>
      </div>

      <DashboardDigitalClock />
    </DashboardWidget>
  );
}
