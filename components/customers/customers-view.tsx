"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CustomerMergeRecommendations } from "@/components/customers/customer-merge-recommendations";
import { CustomersHeaderActions } from "@/components/customers/customers-header-actions";
import { CustomersSummary } from "@/components/customers/customers-summary";
import { CustomersTable } from "@/components/customers/customers-table";
import { CustomersToolbar } from "@/components/customers/customers-toolbar";
import { MobileAddFab } from "@/components/shared/mobile-add-fab";
import { DASHBOARD_WIDGET_GAP } from "@/config/dashboard";
import { MOBILE_ADD_FAB_SCROLL_PAD } from "@/config/mobile-floating";
import { getCustomerSummary, listCustomers } from "@/lib/customers/data";
import { filterCustomers, parseCustomerFilters } from "@/lib/customers/filters";
import { cn } from "@/lib/utils";

function CustomersViewContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [customersSnapshot, setCustomersSnapshot] = useState(() =>
    listCustomers(),
  );
  const filters = useMemo(
    () => parseCustomerFilters(searchParams),
    [searchParams],
  );
  const customers = useMemo(
    () => filterCustomers(customersSnapshot, filters),
    [customersSnapshot, filters],
  );
  const summary = useMemo(() => getCustomerSummary(customers), [customers]);

  const handleResolved = useCallback(() => {
    setCustomersSnapshot(listCustomers());
  }, []);

  useEffect(() => {
    if (searchParams.get("import") !== "1") return;

    toast.message("Import Excel coming soon", {
      description:
        "Upload will detect matching WhatsApp numbers or emails and suggest merges.",
    });

    const next = new URLSearchParams(searchParams.toString());
    next.delete("import");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  return (
    <div
      className={cn(
        "flex w-full flex-col",
        DASHBOARD_WIDGET_GAP,
        MOBILE_ADD_FAB_SCROLL_PAD,
      )}
    >
      <CustomersHeaderActions customers={customers} />
      <CustomersSummary summary={summary} />
      <CustomerMergeRecommendations onResolved={handleResolved} />
      <CustomersToolbar filters={filters} />
      <CustomersTable customers={customers} />
      <MobileAddFab href="/customers/new" label="Tambah customer" />
    </div>
  );
}

export function CustomersView() {
  return (
    <Suspense fallback={null}>
      <CustomersViewContent />
    </Suspense>
  );
}
