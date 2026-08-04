import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CUSTOMER_TAG_CLASS } from "@/config/customers";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { CUSTOMER_TAG_LABELS } from "@/lib/customers/data";
import { Building2Icon, Pencil } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { CustomerDetail } from "@/types/customer";

interface CustomerProfileCardProps {
  customer: CustomerDetail;
}

export function CustomerProfileCard({ customer }: CustomerProfileCardProps) {
  const title = customer.picName || customer.companyName || customer.whatsapp;
  const initial = title.slice(0, 1).toUpperCase();

  return (
    <section className={cn(APP_PANEL_SURFACE, "rounded-2xl p-5")}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
            {initial}
          </span>
          <div className="min-w-0 space-y-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Customer (PIC)
              </p>
              <h1 className="truncate text-xl font-semibold tracking-tight">
                {customer.picName || "Customer tanpa nama"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {[customer.jobTitle, customer.companyName]
                  .filter(Boolean)
                  .join(" · ") || "Profil customer di sisi client"}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {customer.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={cn("border-0", CUSTOMER_TAG_CLASS[tag])}
                >
                  {CUSTOMER_TAG_LABELS[tag]}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href={`/customers/${customer.id}?edit=1`}>
            <Pencil data-icon="inline-start" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.04]">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            WA customer
          </p>
          <p className="mt-1 font-medium tabular-nums">{customer.whatsapp}</p>
        </div>
        <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.04]">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Email customer
          </p>
          <p className="mt-1 font-medium">{customer.email || "—"}</p>
        </div>
        <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.04]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2Icon className="size-3.5" aria-hidden />
            <p className="text-[11px] font-medium uppercase tracking-wide">
              Perusahaan
            </p>
          </div>
          <p className="mt-1 font-medium">{customer.companyName || "—"}</p>
        </div>
        <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.04]">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Aktivitas terakhir
          </p>
          <p className="mt-1 font-medium">{customer.lastActivityLabel}</p>
        </div>
      </div>
    </section>
  );
}
