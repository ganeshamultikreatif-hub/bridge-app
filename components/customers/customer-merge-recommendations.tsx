"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CustomerMergeDialog } from "@/components/customers/customer-merge-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import {
  dismissPendingMerge,
  getCustomerById,
  getPendingMergeProposal,
  listPendingMerges,
  mergeCustomer,
} from "@/lib/customers/data";
import { MERGE_FIELD_LABEL } from "@/lib/customers/merge";
import {
  getDivisionById,
  getProductById,
  getSalesById,
} from "@/lib/customers/org";
import { Layers, Users } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type {
  CustomerMergeField,
  CustomerMergeProposal,
  CustomerPendingMerge,
} from "@/types/customer";

const FIELD_ORDER: CustomerMergeField[] = [
  "picName",
  "email",
  "companyName",
  "jobTitle",
];

interface CustomerMergeRecommendationsProps {
  className?: string;
  onResolved?: () => void;
}

export function CustomerMergeRecommendations({
  className,
  onResolved,
}: CustomerMergeRecommendationsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(() => listPendingMerges());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [proposal, setProposal] = useState<CustomerMergeProposal | null>(null);
  const [merging, setMerging] = useState(false);

  const cards = useMemo(() => {
    return pending
      .map((item) => {
        const existing = getCustomerById(item.existingContactId);
        if (!existing) return null;
        return { item, existing };
      })
      .filter(Boolean) as Array<{
      item: CustomerPendingMerge;
      existing: NonNullable<ReturnType<typeof getCustomerById>>;
    }>;
  }, [pending]);

  function refresh() {
    setPending(listPendingMerges());
    onResolved?.();
  }

  function openMerge(pendingId: string) {
    const next = getPendingMergeProposal(pendingId);
    if (!next) {
      toast.error("Pending merge tidak ditemukan");
      refresh();
      return;
    }
    setActiveId(pendingId);
    setProposal(next);
  }

  function handleConfirm(
    resolutions: Partial<Record<CustomerMergeField, "existing" | "incoming">>,
  ) {
    if (!proposal || !activeId) return;
    setMerging(true);
    const updated = mergeCustomer(
      proposal.existing.id,
      proposal.incoming,
      resolutions,
    );
    setMerging(false);
    setProposal(null);
    setActiveId(null);

    if (!updated) {
      toast.error("Merge gagal");
      return;
    }

    toast.success("Kontak digabung", {
      description: "Membership produk ditambahkan ke identity yang sama.",
    });
    refresh();
    router.refresh();
  }

  function handleDismiss(id: string) {
    dismissPendingMerge(id);
    toast.message("Saran merge diabaikan");
    refresh();
  }

  if (cards.length === 0) return null;

  return (
    <>
      <section
        className={cn(APP_PANEL_SURFACE, "rounded-2xl p-4 sm:p-5", className)}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-sm">
              Saran merge — WA atau email cocok
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Bandingkan Division + Sales di kedua sisi. Nama di kiri/kanan
              adalah{" "}
              <span className="font-medium text-foreground">
                customer (PIC)
              </span>
              ; Maya/Bima adalah{" "}
              <span className="font-medium text-foreground">sales owner</span>.
            </p>
          </div>
          <Badge variant="secondary" className="border-0 tabular-nums">
            {cards.length}
          </Badge>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {cards.map(({ item, existing }) => {
            const product = getProductById(item.incoming.productId);
            const division = getDivisionById(item.incoming.divisionId);
            const sales = getSalesById(item.incoming.salesId);
            const existingLabel =
              existing.picName || existing.companyName || existing.whatsapp;
            const existingOwner = existing.memberships[0];

            return (
              <article
                key={item.id}
                className="flex flex-col rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-3.5 dark:bg-amber-400/[0.07]"
              >
                <div className="flex items-start gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-200">
                    <Layers className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">
                      {item.matchKind === "email"
                        ? `Email · ${item.matchValue}`
                        : `WA customer · ${item.whatsapp}`}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.sourceLabel} · {item.detectedAtLabel}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/70 bg-background/80 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Customer tersimpan
                    </p>
                    <p className="mt-1 truncate text-sm font-medium">
                      {existingLabel}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Perusahaan: {existing.companyName || "—"}
                    </p>
                    <dl className="mt-2 space-y-1 border-t border-border/60 pt-2 text-xs">
                      <div className="flex justify-between gap-2">
                        <dt className="text-muted-foreground">Division</dt>
                        <dd className="truncate font-medium text-foreground">
                          {existingOwner?.divisionName ?? "—"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-muted-foreground">Sales</dt>
                        <dd className="truncate font-medium text-foreground">
                          {existingOwner?.salesName ?? "—"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-muted-foreground">Product</dt>
                        <dd className="truncate font-medium text-foreground">
                          {existingOwner?.productName ?? "—"}
                        </dd>
                      </div>
                    </dl>
                    <Link
                      href={`/customers/${existing.id}`}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <Users className="size-3" aria-hidden />
                      Lihat customer
                    </Link>
                  </div>

                  <div className="rounded-xl border border-border/70 bg-background/80 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Data customer baru
                    </p>
                    <p className="mt-1 truncate text-sm font-medium">
                      {item.incoming.picName || "—"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Perusahaan: {item.incoming.companyName || "—"}
                    </p>
                    <dl className="mt-2 space-y-1 border-t border-border/60 pt-2 text-xs">
                      <div className="flex justify-between gap-2">
                        <dt className="text-muted-foreground">Division</dt>
                        <dd className="truncate font-medium text-foreground">
                          {division?.name ?? "—"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-muted-foreground">Sales</dt>
                        <dd className="truncate font-medium text-foreground">
                          {sales?.name ?? "—"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-muted-foreground">Product</dt>
                        <dd className="truncate font-medium text-foreground">
                          {product?.name ?? "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-dashed border-border/80 bg-background/60 px-3 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Nilai customer yang disarankan
                  </p>
                  <dl className="mt-2 space-y-1.5">
                    {FIELD_ORDER.map((field) => {
                      const pick = item.recommended[field] ?? "existing";
                      const existingValue = existing[field];
                      const incomingValue = item.incoming[field];
                      const value =
                        pick === "incoming"
                          ? incomingValue || existingValue
                          : existingValue || incomingValue;
                      if (!value) return null;
                      return (
                        <div
                          key={field}
                          className="flex items-baseline justify-between gap-2 text-sm"
                        >
                          <dt className="text-xs text-muted-foreground">
                            {MERGE_FIELD_LABEL[field]}
                          </dt>
                          <dd className="min-w-0 truncate text-right font-medium">
                            {value}
                            <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">
                              (
                              {pick === "incoming"
                                ? "dari data baru"
                                : "dari tersimpan"}
                              )
                            </span>
                          </dd>
                        </div>
                      );
                    })}
                    <div className="flex items-baseline justify-between gap-2 border-t border-border/60 pt-1.5 text-sm">
                      <dt className="text-xs text-muted-foreground">
                        Tambah membership
                      </dt>
                      <dd className="truncate text-right font-medium">
                        <span className="block">
                          Division: {division?.name ?? "—"}
                        </span>
                        <span className="block">
                          Sales: {sales?.name ?? "—"}
                        </span>
                        <span className="block text-muted-foreground">
                          {product?.name}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => openMerge(item.id)}
                  >
                    Review & merge
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDismiss(item.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <CustomerMergeDialog
        open={Boolean(proposal)}
        proposal={proposal}
        merging={merging}
        onOpenChange={(open) => {
          if (!open) {
            setProposal(null);
            setActiveId(null);
          }
        }}
        onConfirm={handleConfirm}
      />
    </>
  );
}
