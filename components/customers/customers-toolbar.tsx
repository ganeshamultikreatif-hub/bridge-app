"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { DashboardFilterSelect } from "@/components/dashboard/dashboard-filter-select";
import { Input } from "@/components/ui/input";
import { CUSTOMER_TAG_OPTIONS } from "@/config/customers";
import { HEADER_TOOLBAR_SEARCH_INPUT } from "@/config/header-toolbar";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import {
  type CustomerFiltersState,
  writeCustomerFilters,
} from "@/lib/customers/filters";
import { ORG_DIVISIONS, ORG_PRODUCTS, ORG_SALES } from "@/lib/customers/org";
import { Building2Icon, Flag, Package, Search, Users } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { CustomerTag } from "@/types/customer";

interface CustomersToolbarProps {
  filters: CustomerFiltersState;
  className?: string;
}

export function CustomersToolbar({
  filters,
  className,
}: CustomersToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(filters.q);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setQuery(filters.q);
  }, [filters.q]);

  const divisionOptions = useMemo(
    () =>
      ORG_DIVISIONS.map((item) => ({
        value: item.id,
        label: item.name,
        icon: Building2Icon,
      })),
    [],
  );

  const salesOptions = useMemo(() => {
    const scoped =
      filters.divisions.length > 0
        ? ORG_SALES.filter((item) =>
            filters.divisions.includes(item.divisionId),
          )
        : ORG_SALES;
    return scoped.map((item) => ({
      value: item.id,
      label: item.name,
      description: ORG_DIVISIONS.find((d) => d.id === item.divisionId)?.name,
      icon: Users,
    }));
  }, [filters.divisions]);

  const productOptions = useMemo(() => {
    let scoped = ORG_PRODUCTS;
    if (filters.sales.length > 0) {
      scoped = scoped.filter((item) => filters.sales.includes(item.salesId));
    } else if (filters.divisions.length > 0) {
      scoped = scoped.filter((item) =>
        filters.divisions.includes(item.divisionId),
      );
    }
    return scoped.map((item) => ({
      value: item.id,
      label: item.name,
      description: ORG_SALES.find((s) => s.id === item.salesId)?.name,
      icon: Package,
    }));
  }, [filters.divisions, filters.sales]);

  const replaceFilters = useCallback(
    (next: CustomerFiltersState) => {
      const params = writeCustomerFilters(
        new URLSearchParams(searchParams.toString()),
        next,
      );
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `/customers?${qs}` : "/customers", {
          scroll: false,
        });
      });
    },
    [router, searchParams],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (query === filters.q) return;
      replaceFilters({ ...filters, q: query.trim() });
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [filters, query, replaceFilters]);

  return (
    <section
      className={cn(
        APP_PANEL_SURFACE,
        "flex flex-col gap-3 rounded-2xl p-3 sm:p-3.5",
        className,
      )}
    >
      <div className="relative min-w-0">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari customer, WA, perusahaan, sales owner…"
          className={cn(
            HEADER_TOOLBAR_SEARCH_INPUT,
            "h-10 w-full rounded-full!",
          )}
          aria-label="Search customers"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <DashboardFilterSelect
          allLabel="Semua divisi"
          description="Divisi internal"
          icon={Building2Icon}
          onChange={(divisions) =>
            replaceFilters({
              ...filters,
              divisions,
              sales: [],
              products: [],
            })
          }
          options={divisionOptions}
          title="Divisi"
          value={filters.divisions}
        />
        <DashboardFilterSelect
          allLabel="Semua sales owner"
          description="Tim internal, bukan customer"
          icon={Users}
          onChange={(sales) =>
            replaceFilters({ ...filters, sales, products: [] })
          }
          options={salesOptions}
          title="Sales owner"
          value={filters.sales}
        />
        <DashboardFilterSelect
          allLabel="Semua produk"
          description="Produk milik sales owner"
          icon={Package}
          onChange={(products) => replaceFilters({ ...filters, products })}
          options={productOptions}
          title="Produk"
          value={filters.products}
        />
        <DashboardFilterSelect
          allLabel="Semua tag"
          description="Tag customer"
          icon={Flag}
          onChange={(tags) =>
            replaceFilters({
              ...filters,
              tags: tags as CustomerTag[],
            })
          }
          options={CUSTOMER_TAG_OPTIONS}
          title="Tag"
          value={filters.tags}
        />
      </div>
    </section>
  );
}
