"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LEAD_STATUS_CLASS, LEAD_STATUS_LABEL } from "@/config/leads";
import { cn } from "@/lib/utils";
import type { LeadCard } from "@/types/lead";

interface LeadBoardCardProps {
  lead: LeadCard;
  /** Native HTML5 drag — prefer dnd-kit parent listeners instead. */
  draggable?: boolean;
  onDragStart?: (leadId: string) => void;
  className?: string;
}

export function LeadBoardCard({
  lead,
  draggable = false,
  onDragStart,
  className,
}: LeadBoardCardProps) {
  return (
    <article
      draggable={draggable}
      onDragStart={
        draggable
          ? (event) => {
              event.dataTransfer.setData("text/lead-id", lead.id);
              event.dataTransfer.effectAllowed = "move";
              onDragStart?.(lead.id);
            }
          : undefined
      }
      className={cn(
        "rounded-xl border border-border/70 bg-card p-3 shadow-sm",
        "transition-[box-shadow,transform] hover:shadow-md",
        draggable && "cursor-grab active:cursor-grabbing",
        !draggable && "cursor-grab",
        className,
      )}
    >
      <div className="flex items-start gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
          {lead.customerName.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href={`/customers/${lead.customerId}`}
            className="block truncate font-medium text-sm hover:text-primary"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            draggable={false}
          >
            {lead.customerName}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            {lead.companyName || lead.whatsapp}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-xs">
        <FlowRow label="Department" value={lead.departmentName} />
        <FlowRow label="Sales" value={lead.salesName} />
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-muted-foreground">Status</span>
          <Badge
            variant="secondary"
            className={cn(
              "border-0 font-medium",
              LEAD_STATUS_CLASS[lead.status],
            )}
          >
            {LEAD_STATUS_LABEL[lead.status]}
          </Badge>
        </div>
      </div>

      <p className="mt-2.5 truncate text-[11px] text-muted-foreground">
        {lead.sourceLabel} · {lead.timeLabel}
      </p>
    </article>
  );
}

function FlowRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium text-foreground">{value}</span>
    </div>
  );
}
