import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { deliveryMapConic, getDeliveryMap } from "@/lib/broadcast/delivery-map";
import { formatMetric } from "@/lib/broadcast/filters";
import { cn } from "@/lib/utils";
import type { BroadcastCampaign } from "@/types/broadcast";

interface BroadcastDeliveryMapProps {
  campaign: BroadcastCampaign;
  className?: string;
}

export function BroadcastDeliveryMap({
  campaign,
  className,
}: BroadcastDeliveryMapProps) {
  const slices = getDeliveryMap(campaign);
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const conic = deliveryMapConic(slices);

  return (
    <section className={cn(APP_PANEL_SURFACE, "rounded-2xl p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold text-sm">Delivery map</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Delivered · Read · Failed · Pending
          </p>
        </div>
        <p className="tabular-nums text-xs text-muted-foreground">
          {formatMetric(total)} recipients
        </p>
      </div>

      <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
        <div
          aria-hidden
          className="relative size-36 shrink-0 rounded-full"
          style={{ background: conic }}
        >
          <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-background">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Audience
            </span>
            <span className="text-lg font-semibold tabular-nums tracking-tight">
              {formatMetric(campaign.audienceCount)}
            </span>
          </div>
        </div>

        <ul className="grid w-full max-w-xs grid-cols-2 gap-2.5">
          {slices.map((slice) => {
            const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
            return (
              <li
                key={slice.key}
                className="rounded-xl border border-border/60 bg-background/70 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: slice.color }}
                    aria-hidden
                  />
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {slice.label}
                  </span>
                </div>
                <p className="mt-1 text-base font-semibold tabular-nums tracking-tight">
                  {formatMetric(slice.value)}
                </p>
                <p className="text-[10px] tabular-nums text-muted-foreground">
                  {pct}%
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
