"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BROADCAST_STATUS_CLASS,
  BROADCAST_STATUS_LABEL,
} from "@/config/broadcast";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { formatMetric, ratePercent } from "@/lib/broadcast/filters";
import { Megaphone } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { BroadcastCampaign } from "@/types/broadcast";

interface BroadcastCampaignTableProps {
  campaigns: BroadcastCampaign[];
  className?: string;
}

export function BroadcastCampaignTable({
  campaigns,
  className,
}: BroadcastCampaignTableProps) {
  if (campaigns.length === 0) {
    return (
      <section
        className={cn(
          APP_PANEL_SURFACE,
          "flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center",
          className,
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Megaphone className="size-5" aria-hidden />
        </div>
        <p className="mt-4 font-semibold text-base">No campaigns found</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Adjust filters or create a broadcast to reach your audience.
        </p>
        <Button asChild className="mt-4">
          <Link href="/broadcast/new">Create Broadcast</Link>
        </Button>
      </section>
    );
  }

  return (
    <section
      className={cn(
        APP_PANEL_SURFACE,
        "overflow-hidden rounded-2xl",
        className,
      )}
    >
      <div className="border-b border-border/70 px-4 py-3">
        <p className="font-semibold text-sm">Campaign List</p>
        <p className="text-xs text-muted-foreground">
          {campaigns.length} campaign{campaigns.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
          <thead className="bg-black/[0.02] text-xs text-muted-foreground dark:bg-white/[0.03]">
            <tr>
              <th className="px-4 py-3 font-medium">Nama Campaign</th>
              <th className="px-3 py-3 font-medium">Department</th>
              <th className="px-3 py-3 font-medium">Audience</th>
              <th className="px-3 py-3 font-medium">Template</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="min-w-[12rem] px-3 py-3 font-medium">Progress</th>
              <th className="px-3 py-3 font-medium text-right">Sent</th>
              <th className="px-3 py-3 font-medium text-right">Read</th>
              <th className="px-4 py-3 font-medium text-right">Reply</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => {
              const progress =
                campaign.audienceCount > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (campaign.sent / campaign.audienceCount) * 100,
                      ),
                    )
                  : 0;
              const failedApprox = Math.max(0, campaign.sent - campaign.read);

              return (
                <tr
                  key={campaign.id}
                  className="border-t border-border/60 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 align-middle">
                    <Link
                      href={`/broadcast/${campaign.id}`}
                      className="group flex min-w-0 items-center gap-3"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Megaphone className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-foreground group-hover:text-primary">
                          {campaign.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {formatMetric(campaign.audienceCount)} recipients
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-3 align-middle">
                    {campaign.departmentName}
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <p className="font-medium">{campaign.audienceName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatMetric(campaign.audienceCount)} contacts
                    </p>
                  </td>
                  <td className="px-3 py-3 align-middle text-muted-foreground">
                    {campaign.templateName}
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border-0 font-medium capitalize",
                        BROADCAST_STATUS_CLASS[campaign.status],
                      )}
                    >
                      {BROADCAST_STATUS_LABEL[campaign.status]}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium tabular-nums text-foreground">
                          {formatMetric(campaign.sent)}/
                          {formatMetric(campaign.audienceCount)}
                        </span>
                        <span className="tabular-nums text-muted-foreground">
                          {progress}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-[width]",
                            campaign.status === "running"
                              ? "bg-amber-500"
                              : campaign.status === "failed"
                                ? "bg-destructive"
                                : "bg-primary",
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {campaign.sent > 0 ? (
                        <p className="truncate text-[10px] text-muted-foreground">
                          Read {formatMetric(campaign.read)} · Reply{" "}
                          {formatMetric(campaign.reply)}
                          {failedApprox > 0
                            ? ` · Unread ${formatMetric(failedApprox)}`
                            : ""}
                        </p>
                      ) : (
                        <p className="text-[10px] text-muted-foreground">
                          Not started
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 align-middle text-right tabular-nums">
                    <p className="font-medium">{formatMetric(campaign.sent)}</p>
                    <p className="text-xs text-muted-foreground">
                      {ratePercent(campaign.sent, campaign.audienceCount)}
                    </p>
                  </td>
                  <td className="px-3 py-3 align-middle text-right tabular-nums">
                    <p className="font-medium">{formatMetric(campaign.read)}</p>
                    <p className="text-xs text-muted-foreground">
                      {ratePercent(campaign.read, campaign.sent)}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-middle text-right tabular-nums">
                    <p className="font-medium">
                      {formatMetric(campaign.reply)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ratePercent(campaign.reply, campaign.sent)}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
