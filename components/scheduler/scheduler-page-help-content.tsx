"use client";

import {
  SCHEDULER_HELP_INTRO,
  SCHEDULER_STATE_COLOR_LEGEND,
  SCHEDULER_STATUS_DOT_LEGEND,
  SCHEDULER_TYPE_COLOR_LEGEND,
  SCHEDULER_USAGE_STEPS,
} from "@/config/scheduler-page-help";
import { cn } from "@/lib/utils";

export function SchedulerPageHelpContent() {
  return (
    <div className="space-y-6 text-sm">
      <p className="leading-relaxed text-muted-foreground">
        {SCHEDULER_HELP_INTRO}
      </p>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
          Kode warna tile
        </h3>
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Garis kiri = tipe jadwal
          </p>
          <ul className="space-y-2">
            {SCHEDULER_TYPE_COLOR_LEGEND.map((item) => (
              <LegendRow
                className={item.className}
                description={item.description}
                key={item.type}
                label={item.label}
              />
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Highlight kondisi
          </p>
          <ul className="space-y-2">
            {SCHEDULER_STATE_COLOR_LEGEND.map((item) => (
              <LegendRow
                className={item.className}
                description={item.description}
                key={item.label}
                label={item.label}
              />
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Dot status (di preview / detail)
          </p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SCHEDULER_STATUS_DOT_LEGEND.map((item) => (
              <li
                className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/30 px-2.5 py-2"
                key={item.status}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-2.5 shrink-0 rounded-full",
                    item.className,
                  )}
                />
                <span className="text-xs font-medium text-foreground">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
          Alur pakai
        </h3>
        <ol className="space-y-2.5">
          {SCHEDULER_USAGE_STEPS.map((step, index) => (
            <li
              className="flex gap-3 rounded-xl border border-border/70 bg-muted/25 px-3 py-2.5"
              key={step.title}
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                {index + 1}
              </span>
              <div className="min-w-0 space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  {step.title}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function LegendRow({
  className,
  description,
  label,
}: {
  className: string;
  description: string;
  label: string;
}) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/25 px-3 py-2.5">
      <span
        aria-hidden
        className={cn("mt-0.5 h-8 w-1.5 shrink-0 rounded-full", className)}
      />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </li>
  );
}
