"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Button } from "@/components/ui/button";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import {
  getSuiteJourneyNextStep,
  SUITE_HANDOFF_PATHS,
  SUITE_JOURNEY_CURRENT_ID,
  SUITE_JOURNEY_STEPS,
} from "@/config/suite-journey";
import { CaretRightIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * End-of-page suite chain: WA → SEO → META → Website Revamp → Ecosystem.
 * Bridge is WA; CTA continues to the next product tab.
 */
export function SuiteJourneyFooter({ className }: { className?: string }) {
  const pathname = usePathname();
  if (SUITE_HANDOFF_PATHS.has(pathname)) {
    return null;
  }

  const next = getSuiteJourneyNextStep();
  if (!next?.href) {
    return null;
  }

  return (
    <SolidSurface
      className={cn(APP_PANEL_SURFACE, "mt-6 mb-2 p-4 sm:p-5", className)}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Product journey
      </p>
      <p className="mt-1 text-sm font-semibold tracking-tight">
        WA → SEO → META → Website Revamp → Ecosystem
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {SUITE_JOURNEY_STEPS.map((step, index) => {
          const isCurrent = step.id === SUITE_JOURNEY_CURRENT_ID;
          const isNext = step.id === next.id;
          return (
            <div key={step.id} className="flex items-center gap-1.5">
              {index > 0 ? (
                <CaretRightIcon
                  className="size-3.5 shrink-0 text-muted-foreground/70"
                  aria-hidden
                />
              ) : null}
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  isCurrent && "bg-foreground text-background shadow-sm",
                  isNext &&
                    !isCurrent &&
                    "bg-primary/15 text-primary ring-1 ring-primary/30",
                  !isCurrent && !isNext && "bg-muted text-muted-foreground",
                )}
              >
                {step.shortLabel}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Selesai di <span className="font-medium text-foreground">WA</span>
          {" · "}
          lanjut ke{" "}
          <span className="font-medium text-foreground">{next.label}</span>
          {" — "}
          {next.description}
        </p>
        <Button asChild className="shrink-0">
          <Link href={next.href}>
            Lanjut ke {next.label}
            <CaretRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </SolidSurface>
  );
}
