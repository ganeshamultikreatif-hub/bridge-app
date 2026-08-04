"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { BroadcastDeliveryMap } from "@/components/broadcast/broadcast-delivery-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BROADCAST_STATUS_CLASS,
  BROADCAST_STATUS_LABEL,
} from "@/config/broadcast";
import { DASHBOARD_WIDGET_GAP } from "@/config/dashboard";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { getBroadcastById } from "@/lib/broadcast/data";
import { formatMetric, ratePercent } from "@/lib/broadcast/filters";
import { CaretLeftIcon, Megaphone } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface BroadcastDetailViewProps {
  id: string;
}

export function BroadcastDetailView({ id }: BroadcastDetailViewProps) {
  const campaign = getBroadcastById(id);
  if (!campaign) {
    notFound();
  }

  const metrics = [
    {
      label: "Sent",
      value: formatMetric(campaign.sent),
      hint: ratePercent(campaign.sent, campaign.audienceCount),
    },
    {
      label: "Read",
      value: formatMetric(campaign.read),
      hint: ratePercent(campaign.read, campaign.sent),
    },
    {
      label: "Reply",
      value: formatMetric(campaign.reply),
      hint: ratePercent(campaign.reply, campaign.sent),
    },
    {
      label: "Audience",
      value: formatMetric(campaign.audienceCount),
      hint: campaign.audienceName,
    },
  ];

  const deliveryProgress =
    campaign.audienceCount > 0
      ? Math.min(
          100,
          Math.round((campaign.sent / campaign.audienceCount) * 100),
        )
      : 0;

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-3xl flex-col",
        DASHBOARD_WIDGET_GAP,
      )}
    >
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/broadcast">
          <CaretLeftIcon data-icon="inline-start" />
          Back to campaigns
        </Link>
      </Button>

      <section className={cn(APP_PANEL_SURFACE, "rounded-2xl p-5")}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Megaphone className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight">
                {campaign.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {campaign.departmentName} · {campaign.templateName}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "border-0 font-medium",
              BROADCAST_STATUS_CLASS[campaign.status],
            )}
          >
            {BROADCAST_STATUS_LABEL[campaign.status]}
          </Badge>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Delivery progress</span>
            <span className="tabular-nums font-medium text-foreground">
              {formatMetric(campaign.sent)}/
              {formatMetric(campaign.audienceCount)} · {deliveryProgress}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${deliveryProgress}%` }}
            />
          </div>
          {campaign.sent > 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Read {formatMetric(campaign.read)} · Reply{" "}
              {formatMetric(campaign.reply)} · Unread{" "}
              {formatMetric(Math.max(0, campaign.sent - campaign.read))}
            </p>
          ) : null}
        </div>
      </section>

      <BroadcastDeliveryMap campaign={campaign} />

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {metrics.map((metric) => (
          <section
            key={metric.label}
            className={cn(APP_PANEL_SURFACE, "rounded-2xl p-4")}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
              {metric.value}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {metric.hint}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
