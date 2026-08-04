"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { DashboardFilterSelect } from "@/components/dashboard/dashboard-filter-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BROADCAST_STATUS_OPTIONS } from "@/config/broadcast";
import { DASHBOARD_DEPARTMENT_OPTIONS } from "@/config/dashboard-filters";
import {
  HEADER_TOOLBAR_BUTTON,
  HEADER_TOOLBAR_SEARCH_INPUT,
} from "@/config/header-toolbar";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import type { BroadcastFiltersState } from "@/lib/broadcast/filters";
import { writeBroadcastFilters } from "@/lib/broadcast/filters";
import { Building2Icon, Flag, Megaphone, PlusIcon, Search } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { BroadcastStatus } from "@/types/broadcast";

const STATUS_FILTER_OPTIONS = BROADCAST_STATUS_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
  icon: Flag,
}));

interface BroadcastToolbarProps {
  filters: BroadcastFiltersState;
  className?: string;
}

export function BroadcastToolbar({
  filters,
  className,
}: BroadcastToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(filters.q);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setQuery(filters.q);
  }, [filters.q]);

  const replaceFilters = useCallback(
    (next: BroadcastFiltersState) => {
      const params = writeBroadcastFilters(
        new URLSearchParams(searchParams.toString()),
        next,
      );
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `/broadcast?${qs}` : "/broadcast", {
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
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search campaign, audience, template…"
            className={cn(
              HEADER_TOOLBAR_SEARCH_INPUT,
              "h-10 w-full rounded-full!",
            )}
            aria-label="Search campaigns"
          />
        </div>

        <Button asChild className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}>
          <Link href="/broadcast/new">
            <PlusIcon data-icon="inline-start" />
            Create Broadcast
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <DashboardFilterSelect
          allLabel="All departments"
          description="Campaign department"
          icon={Building2Icon}
          onChange={(departments) =>
            replaceFilters({ ...filters, departments })
          }
          options={DASHBOARD_DEPARTMENT_OPTIONS}
          title="Department"
          value={filters.departments}
        />
        <DashboardFilterSelect
          allLabel="All statuses"
          description="Draft to completed"
          icon={Megaphone}
          onChange={(statuses) =>
            replaceFilters({
              ...filters,
              statuses: statuses as BroadcastStatus[],
            })
          }
          options={STATUS_FILTER_OPTIONS}
          title="Status"
          value={filters.statuses}
        />
      </div>
    </section>
  );
}
