"use client";

import { useEffect, useState } from "react";
import {
  formatDashboardSeconds,
  formatDashboardTime,
} from "@/config/dashboard";

export function DashboardDigitalClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const timeLabel = now ? formatDashboardTime(now) : "--:--";
  const secondsLabel = now ? formatDashboardSeconds(now) : "--";

  return (
    <output
      className="flex shrink-0 items-baseline justify-end gap-1 tabular-nums"
      aria-live="polite"
      aria-label={now ? `Current time ${timeLabel}` : "Loading time"}
    >
      <span className="inline-block min-w-[7.5ch] text-right font-semibold text-2xl leading-none tracking-tight text-foreground sm:min-w-[8.5ch] sm:text-3xl">
        {timeLabel}
      </span>
      <span className="inline-block min-w-[2ch] font-medium text-muted-foreground text-xs leading-none sm:text-sm">
        {secondsLabel}
      </span>
    </output>
  );
}
