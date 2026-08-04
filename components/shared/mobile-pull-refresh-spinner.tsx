"use client";

import { cn } from "@/lib/utils";

const SPINNER_BLADES = [
  "b0",
  "b1",
  "b2",
  "b3",
  "b4",
  "b5",
  "b6",
  "b7",
  "b8",
  "b9",
  "b10",
  "b11",
] as const;

interface MobilePullRefreshSpinnerProps {
  /** 0–1 while dragging; ignored when refreshing. */
  progress?: number;
  refreshing?: boolean;
  /** Rubber-band translate of the scroll surface (px). */
  offsetPx?: number;
  className?: string;
}

/** iOS-style activity spinner for pull-to-refresh overscroll (wang). */
export function MobilePullRefreshSpinner({
  progress = 0,
  refreshing = false,
  offsetPx = 0,
  className,
}: MobilePullRefreshSpinnerProps) {
  const visibleOffset = refreshing ? Math.max(offsetPx, 44) : offsetPx;
  const show = refreshing || visibleOffset > 10;

  if (!show) {
    return null;
  }

  const reveal = refreshing ? 1 : Math.min(1, Math.max(0, progress));
  const bladeCount = SPINNER_BLADES.length;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 z-20 flex justify-center md:hidden",
        className,
      )}
      style={{
        top: "var(--mobile-safe-top, 0px)",
        height: visibleOffset,
      }}
    >
      <div
        className={cn(
          "relative mt-auto mb-2 size-7 text-foreground/45",
          refreshing && "mobile-pull-refresh-spinning",
        )}
        style={refreshing ? undefined : { opacity: 0.25 + reveal * 0.75 }}
      >
        {SPINNER_BLADES.map((bladeId, index) => {
          const bladeProgress = (index + 1) / bladeCount;
          const lit = refreshing || reveal >= bladeProgress * 0.85;
          return (
            <span
              key={bladeId}
              className="mobile-pull-refresh-blade absolute top-0 left-1/2 origin-[center_14px]"
              style={{
                transform: `rotate(${(360 / bladeCount) * index}deg)`,
                opacity: lit ? 0.95 - (index / bladeCount) * 0.55 : 0.12,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
