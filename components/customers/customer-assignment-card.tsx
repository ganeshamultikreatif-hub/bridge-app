import { Badge } from "@/components/ui/badge";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { Package } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { CustomerDetail } from "@/types/customer";

interface CustomerAssignmentCardProps {
  customer: CustomerDetail;
  className?: string;
}

export function CustomerAssignmentCard({
  customer,
  className,
}: CustomerAssignmentCardProps) {
  return (
    <section className={cn(APP_PANEL_SURFACE, "rounded-2xl p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-sm">Sales owner & produk</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Ini tim internal Bridge yang menangani customer di atas — bukan nama
            customer.
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Package className="size-4" aria-hidden />
        </span>
      </div>

      {customer.memberships.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Belum ada sales owner / produk.
        </p>
      ) : (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {customer.memberships.map((membership) => (
            <li
              key={membership.id}
              className="rounded-xl border border-border/70 px-3.5 py-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Sales owner
                  </p>
                  <p className="mt-0.5 font-medium">{membership.salesName}</p>
                </div>
                {membership.source ? (
                  <Badge variant="secondary" className="border-0 capitalize">
                    {membership.source}
                  </Badge>
                ) : null}
              </div>
              <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between gap-2">
                  <dt>Divisi</dt>
                  <dd className="font-medium text-foreground">
                    {membership.divisionName}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Produk</dt>
                  <dd className="font-medium text-foreground">
                    {membership.productName}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
