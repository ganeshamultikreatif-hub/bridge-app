import type { BroadcastCampaign } from "@/types/broadcast";

export type DeliveryMapSlice = {
  key: "delivered" | "read" | "failed" | "pending";
  label: string;
  value: number;
  color: string;
};

/** Mutually exclusive delivery buckets for the Meta-style map pie. */
export function getDeliveryMap(
  campaign: BroadcastCampaign,
): DeliveryMapSlice[] {
  const audience = campaign.audienceCount;
  const sent = Math.min(campaign.sent, audience);
  const unsent = Math.max(0, audience - sent);

  const failed =
    campaign.status === "failed"
      ? unsent
      : Math.min(sent, Math.round(sent * 0.015));
  const pending = campaign.status === "failed" ? 0 : unsent;
  const read = Math.min(campaign.read, Math.max(0, sent - failed));
  const delivered = Math.max(0, sent - read - failed);

  return [
    {
      key: "delivered",
      label: "Delivered",
      value: delivered,
      color: "var(--chart-1, oklch(0.62 0.14 250))",
    },
    {
      key: "read",
      label: "Read",
      value: read,
      color: "var(--chart-2, oklch(0.68 0.15 155))",
    },
    {
      key: "failed",
      label: "Failed",
      value: failed,
      color: "var(--chart-5, oklch(0.62 0.18 25))",
    },
    {
      key: "pending",
      label: "Pending",
      value: pending,
      color: "var(--muted-foreground)",
    },
  ];
}

export function deliveryMapConic(slices: DeliveryMapSlice[]): string {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  if (total <= 0) {
    return "conic-gradient(var(--muted) 0deg 360deg)";
  }

  let cursor = 0;
  const stops: string[] = [];
  for (const slice of slices) {
    if (slice.value <= 0) continue;
    const start = (cursor / total) * 360;
    cursor += slice.value;
    const end = (cursor / total) * 360;
    stops.push(`${slice.color} ${start}deg ${end}deg`);
  }

  return `conic-gradient(${stops.join(", ")})`;
}
