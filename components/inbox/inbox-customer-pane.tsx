"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CUSTOMER_TAG_CLASS } from "@/config/customers";
import { CUSTOMER_TAG_LABELS } from "@/lib/customers/data";
import {
  Building2Icon,
  CaretLeftIcon,
  ExternalLink,
  Tag,
  Users,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { CustomerTag } from "@/types/customer";
import type { InboxConversation } from "@/types/inbox";

interface InboxCustomerPaneProps {
  conversation: InboxConversation | null;
  onBack?: () => void;
  className?: string;
}

export function InboxCustomerPane({
  conversation,
  onBack,
  className,
}: InboxCustomerPaneProps) {
  const [note, setNote] = useState("");

  // Reset composer when switching conversation identity.
  // biome-ignore lint/correctness/useExhaustiveDependencies: only reset on conversation change
  useEffect(() => {
    setNote("");
  }, [conversation?.id]);

  if (!conversation) {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-col items-center justify-center px-4 text-center text-sm text-muted-foreground",
          className,
        )}
      >
        Customer detail muncul setelah conversation dipilih.
      </div>
    );
  }

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="flex shrink-0 items-center gap-2 border-b border-border/70 px-3 py-2.5">
        {onBack ? (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="lg:hidden"
            onClick={onBack}
            aria-label="Back to chat"
          >
            <CaretLeftIcon className="size-4" />
          </Button>
        ) : null}
        <div className="min-w-0">
          <p className="font-semibold text-sm">Customer</p>
          <p className="text-xs text-muted-foreground">Context & history</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
        <section className="space-y-3">
          <div>
            <p className="text-base font-semibold tracking-tight">
              {conversation.customerName}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {[conversation.jobTitle, conversation.companyName]
                .filter(Boolean)
                .join(" · ") || conversation.whatsapp}
            </p>
          </div>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">WhatsApp</dt>
              <dd className="font-medium tabular-nums">
                {conversation.whatsapp}
              </dd>
            </div>
            {conversation.email ? (
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="font-medium">{conversation.email}</dd>
              </div>
            ) : null}
          </dl>
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/customers/${conversation.customerId}`}>
              <ExternalLink data-icon="inline-start" />
              Open customer
            </Link>
          </Button>
        </section>

        <section className="space-y-2 border-t border-border/60 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Assigned sales
          </p>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
              {conversation.assignedSalesName.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="font-semibold">{conversation.assignedSalesName}</p>
              <p className="text-xs text-muted-foreground">Sales owner</p>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() =>
              toast.message("Reassign sales coming soon", {
                description: "Pindahkan conversation ke sales owner lain.",
              })
            }
          >
            Reassign
          </Button>
        </section>

        <section className="space-y-2 border-t border-border/60 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Department
          </p>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Building2Icon className="size-3.5" aria-hidden />
              Division
            </span>
            <span className="font-medium">{conversation.divisionName}</span>
          </div>
          {conversation.productName ? (
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Users className="size-3.5" aria-hidden />
                Product
              </span>
              <span className="font-medium">{conversation.productName}</span>
            </div>
          ) : null}
        </section>

        <section className="space-y-2 border-t border-border/60 pt-4">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <Tag className="size-3" aria-hidden />
            Tags
          </p>
          {conversation.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {conversation.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={cn(
                    "border-0",
                    CUSTOMER_TAG_CLASS[tag as CustomerTag],
                  )}
                >
                  {CUSTOMER_TAG_LABELS[tag as CustomerTag] ?? tag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No tags</p>
          )}
        </section>

        <section className="space-y-2 border-t border-border/60 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Notes
          </p>
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Internal note (demo, tidak tersimpan)…"
            rows={3}
            className="resize-none rounded-xl text-sm"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-full"
            disabled={!note.trim()}
            onClick={() => {
              toast.success("Note disimpan (demo)");
              setNote("");
            }}
          >
            Save note
          </Button>
        </section>

        <section className="border-t border-border/60 pt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            History
          </p>
          <ol className="space-y-3">
            {conversation.activity.map((item) => (
              <li key={item.id} className="relative pl-4">
                <span
                  className={cn(
                    "absolute top-1.5 left-0 size-2 rounded-full",
                    item.tone === "success" && "bg-emerald-500",
                    item.tone === "warning" && "bg-amber-500",
                    (!item.tone || item.tone === "default") &&
                      "bg-muted-foreground/50",
                  )}
                />
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {item.timeLabel}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
