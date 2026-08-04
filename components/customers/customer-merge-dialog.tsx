"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MERGE_FIELD_LABEL } from "@/lib/customers/merge";
import { cn } from "@/lib/utils";
import type {
  CustomerMergeField,
  CustomerMergeProposal,
} from "@/types/customer";

interface CustomerMergeDialogProps {
  open: boolean;
  proposal: CustomerMergeProposal | null;
  merging?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (
    resolutions: Partial<Record<CustomerMergeField, "existing" | "incoming">>,
  ) => void;
}

export function CustomerMergeDialog({
  open,
  proposal,
  merging,
  onOpenChange,
  onConfirm,
}: CustomerMergeDialogProps) {
  const [resolutions, setResolutions] = useState<
    Partial<Record<CustomerMergeField, "existing" | "incoming">>
  >({});

  useEffect(() => {
    if (!proposal) return;
    const initial: Partial<
      Record<CustomerMergeField, "existing" | "incoming">
    > = {};
    for (const conflict of proposal.conflicts) {
      initial[conflict.field] = conflict.existing ? "existing" : "incoming";
    }
    setResolutions(initial);
  }, [proposal]);

  if (!proposal) return null;

  const { existing, incoming, membershipPreview, conflicts, matchKind } =
    proposal;
  const existingLabel =
    existing.picName || existing.companyName || existing.whatsapp;
  const matchLabel =
    matchKind === "email"
      ? existing.email || incoming.email || "—"
      : existing.whatsapp;
  const existingOwner = existing.memberships[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {matchKind === "email"
              ? "Email customer sudah terdaftar"
              : "Nomor WA customer sudah terdaftar"}
          </DialogTitle>
          <DialogDescription>
            Customer{" "}
            <span className="font-medium text-foreground">{existingLabel}</span>{" "}
            cocok lewat{" "}
            <span className="font-medium text-foreground">
              {matchKind === "email" ? "email" : "WhatsApp"} {matchLabel}
            </span>
            . Merge menambahkan Division / Sales / produk baru ke identity yang
            sama — bukan membuat orang baru.
            {existingOwner ? (
              <>
                {" "}
                Saat ini di{" "}
                <span className="font-medium text-foreground">
                  {existingOwner.divisionName}
                </span>{" "}
                ·{" "}
                <span className="font-medium text-foreground">
                  {existingOwner.salesName}
                </span>
                .
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <div
          data-slot="dialog-body"
          className="space-y-4 overflow-y-auto px-5 py-4"
        >
          <div className="rounded-xl border border-border/70 bg-muted/40 px-3.5 py-3 text-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Sales owner & produk yang akan ditambahkan
            </p>
            <p className="mt-1 font-medium">
              {membershipPreview.salesName} · {membershipPreview.productName}
            </p>
            <p className="text-xs text-muted-foreground">
              Divisi {membershipPreview.divisionName}
            </p>
          </div>

          {conflicts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tidak ada field yang bentrok. Merge akan menambahkan product
              membership ke kontak yang sudah ada.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium">
                Pilih nilai yang dipertahankan
              </p>
              {conflicts.map((conflict) => {
                const choice = resolutions[conflict.field] ?? "existing";
                return (
                  <div
                    key={conflict.field}
                    className="rounded-xl border border-border/70 p-3"
                  >
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {MERGE_FIELD_LABEL[conflict.field]}
                    </p>
                    <RadioGroup
                      value={choice}
                      onValueChange={(value) =>
                        setResolutions((current) => ({
                          ...current,
                          [conflict.field]: value as "existing" | "incoming",
                        }))
                      }
                      className="grid gap-2"
                    >
                      <label
                        className={cn(
                          "flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2",
                          choice === "existing"
                            ? "border-primary/40 bg-primary/5"
                            : "border-transparent hover:bg-muted/50",
                        )}
                      >
                        <RadioGroupItem value="existing" className="mt-0.5" />
                        <span className="min-w-0">
                          <span className="block text-[11px] text-muted-foreground">
                            Customer tersimpan
                          </span>
                          <span className="font-medium">
                            {conflict.existing || "—"}
                          </span>
                        </span>
                      </label>
                      <label
                        className={cn(
                          "flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2",
                          choice === "incoming"
                            ? "border-primary/40 bg-primary/5"
                            : "border-transparent hover:bg-muted/50",
                        )}
                      >
                        <RadioGroupItem value="incoming" className="mt-0.5" />
                        <span className="min-w-0">
                          <span className="block text-[11px] text-muted-foreground">
                            Data customer baru
                          </span>
                          <span className="font-medium">
                            {conflict.incoming || "—"}
                          </span>
                        </span>
                      </label>
                    </RadioGroup>
                  </div>
                );
              })}
            </div>
          )}

          {existing.memberships.length > 0 ? (
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sales owner saat ini
              </p>
              <ul className="space-y-1 text-sm">
                {existing.memberships.map((membership) => (
                  <li key={membership.id} className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {membership.salesName}
                    </span>
                    {" · "}
                    {membership.divisionName} / {membership.productName}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={merging}
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={merging}
            onClick={() => onConfirm(resolutions)}
          >
            {merging ? "Merging…" : "Merge informasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
