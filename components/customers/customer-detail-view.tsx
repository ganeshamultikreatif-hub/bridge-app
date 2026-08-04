"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { toast } from "sonner";
import {
  buildCustomerActivity,
  CustomerActivity,
} from "@/components/customers/customer-activity";
import { CustomerBroadcastHistory } from "@/components/customers/customer-broadcast-history";
import { CustomerNotes } from "@/components/customers/customer-notes";
import { CustomerTimeline } from "@/components/customers/customer-timeline";
import { HeaderActions } from "@/components/shared/header-actions";
import { HeaderBackButton } from "@/components/shared/header-leading";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CUSTOMER_TAG_CLASS } from "@/config/customers";
import { DASHBOARD_WIDGET_GAP } from "@/config/dashboard";
import { HEADER_TOOLBAR_BUTTON } from "@/config/header-toolbar";
import { CUSTOMER_TAG_LABELS, getCustomerById } from "@/lib/customers/data";
import {
  Building2Icon,
  MessageIcon,
  Package,
  Pencil,
  UserRound,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { CustomerDetail } from "@/types/customer";

interface CustomerDetailViewProps {
  customerId: string;
}

function PropertyRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-0.5 border-b border-border/50 py-2.5 last:border-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="text-sm font-medium leading-snug text-foreground">
        {value || "—"}
      </div>
    </div>
  );
}

function CustomerPropertiesRail({ customer }: { customer: CustomerDetail }) {
  const divisions = [
    ...new Set(customer.memberships.map((m) => m.divisionName)),
  ];
  const sales = [...new Set(customer.memberships.map((m) => m.salesName))];
  const products = [...new Set(customer.memberships.map((m) => m.productName))];

  return (
    <SolidSurface className="p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-semibold text-primary">
          {(customer.picName || customer.companyName || "?")
            .slice(0, 1)
            .toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-sm">
            {customer.picName || "Unnamed customer"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {customer.jobTitle || "Contact"}
          </p>
        </div>
      </div>

      <PropertyRow
        label="Company"
        value={
          <span className="inline-flex items-center gap-1.5">
            <Building2Icon
              className="size-3.5 text-muted-foreground"
              aria-hidden
            />
            {customer.companyName || "—"}
          </span>
        }
      />
      <PropertyRow
        label="PIC"
        value={
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="size-3.5 text-muted-foreground" aria-hidden />
            {customer.picName || "—"}
          </span>
        }
      />
      <PropertyRow label="Phone / WA" value={customer.whatsapp} />
      <PropertyRow label="Email" value={customer.email || "—"} />
      <PropertyRow
        label="Tags"
        value={
          customer.tags.length === 0 ? (
            "—"
          ) : (
            <div className="flex flex-wrap gap-1">
              {customer.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={cn(
                    "border-0 text-[10px]",
                    CUSTOMER_TAG_CLASS[tag],
                  )}
                >
                  {CUSTOMER_TAG_LABELS[tag]}
                </Badge>
              ))}
            </div>
          )
        }
      />
      <PropertyRow
        label="Division"
        value={divisions.length ? divisions.join(", ") : "—"}
      />
      <PropertyRow
        label="Sales"
        value={sales.length ? sales.join(", ") : "—"}
      />
      <PropertyRow
        label="Products"
        value={
          products.length === 0 ? (
            "—"
          ) : (
            <span className="inline-flex items-start gap-1.5">
              <Package
                className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <span>{products.join(", ")}</span>
            </span>
          )
        }
      />
      <PropertyRow
        label="Health · Last contacted"
        value={customer.lastActivityLabel}
      />
    </SolidSurface>
  );
}

export function CustomerDetailView({ customerId }: CustomerDetailViewProps) {
  const customer = getCustomerById(customerId);

  if (!customer) {
    notFound();
  }

  const detail = customer;
  const activityItems = buildCustomerActivity(
    detail.timeline,
    detail.broadcasts,
  );

  function handleWhatsApp() {
    toast.message("WhatsApp coming soon", {
      description: `Open chat with ${detail.whatsapp}`,
    });
  }

  function handleEdit() {
    toast.message("Edit customer coming soon", {
      description: "Inline property editing will land here.",
    });
  }

  return (
    <>
      <HeaderBackButton href="/customers" label="Back to customers" />

      <HeaderActions disableMobileFallback>
        <Button
          type="button"
          variant="outline"
          className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
          onClick={handleWhatsApp}
        >
          <MessageIcon data-icon="inline-start" />
          WhatsApp
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
          onClick={handleEdit}
        >
          <Pencil data-icon="inline-start" />
          Edit
        </Button>
        <Button asChild className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}>
          <Link href="/inbox">Open Inbox</Link>
        </Button>
      </HeaderActions>

      <div
        className={cn(
          "grid w-full grid-cols-1 items-start lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)]",
          DASHBOARD_WIDGET_GAP,
        )}
      >
        <CustomerPropertiesRail customer={detail} />

        <div className={cn("flex min-w-0 flex-col", DASHBOARD_WIDGET_GAP)}>
          <SolidSurface className="p-1.5 sm:p-2">
            <Tabs defaultValue="timeline" className="w-full gap-3">
              <TabsList className="mx-1 mt-1 w-full max-w-md sm:mx-2">
                <TabsTrigger value="timeline" className="flex-1">
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex-1">
                  Activity
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex-1">
                  Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="px-1 pb-2 sm:px-2">
                <CustomerTimeline
                  items={detail.timeline}
                  className="h-auto min-h-72 border-0 bg-transparent p-0 shadow-none"
                  embedded
                />
              </TabsContent>

              <TabsContent value="activity" className="px-1 pb-2 sm:px-2">
                <CustomerActivity
                  items={activityItems}
                  className="border-0 bg-transparent p-0 shadow-none"
                />
              </TabsContent>

              <TabsContent value="notes" className="px-1 pb-2 sm:px-2">
                <CustomerNotes
                  items={detail.notes}
                  className="h-auto min-h-72 border-0 bg-transparent p-0 shadow-none"
                  embedded
                />
              </TabsContent>
            </Tabs>
          </SolidSurface>

          <CustomerBroadcastHistory
            items={detail.broadcasts}
            className="h-auto min-h-48"
          />
        </div>
      </div>
    </>
  );
}
