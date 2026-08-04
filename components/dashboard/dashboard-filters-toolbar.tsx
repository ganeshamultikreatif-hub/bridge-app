"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { DashboardDateFilter } from "@/components/dashboard/dashboard-date-filter";
import { DashboardFilterSelect } from "@/components/dashboard/dashboard-filter-select";
import { DashboardMobileFilters } from "@/components/dashboard/dashboard-mobile-filters";
import {
  HeaderActions,
  HeaderActionsBadge,
} from "@/components/shared/header-actions";
import { DASHBOARD_DEPARTMENT_OPTIONS } from "@/config/dashboard-filters";
import type { DashboardDateRange } from "@/lib/dashboard/date-range";
import { getDefaultDashboardDateRange } from "@/lib/dashboard/date-range";
import {
  countActiveDashboardFilters,
  type DashboardFiltersState,
  writeDashboardFilters,
} from "@/lib/dashboard/filters";
import { Building2Icon } from "@/lib/icons";

interface DashboardFiltersToolbarProps {
  filters: DashboardFiltersState;
}

export function DashboardFiltersToolbar({
  filters,
}: DashboardFiltersToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCount = countActiveDashboardFilters(filters);

  const replaceFilters = useCallback(
    (next: DashboardFiltersState) => {
      const params = writeDashboardFilters(
        new URLSearchParams(searchParams.toString()),
        next,
      );
      const query = params.toString();
      router.replace(query ? `/dashboard?${query}` : "/dashboard", {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const handleDepartmentsChange = useCallback(
    (departments: string[]) => {
      replaceFilters({ ...filters, departments });
    },
    [filters, replaceFilters],
  );

  const handleRangeChange = useCallback(
    (range: DashboardDateRange) => {
      replaceFilters({ ...filters, range });
    },
    [filters, replaceFilters],
  );

  const handleResetFilters = useCallback(() => {
    replaceFilters({
      departments: [],
      range: getDefaultDashboardDateRange(),
    });
  }, [replaceFilters]);

  return (
    <>
      <HeaderActionsBadge count={activeCount} />

      <HeaderActions viewport="mobile">
        <DashboardMobileFilters
          filters={filters}
          hasActiveFilters={activeCount > 0}
          onDepartmentsChange={handleDepartmentsChange}
          onRangeChange={handleRangeChange}
          onResetFilters={handleResetFilters}
        />
      </HeaderActions>

      <HeaderActions>
        <DashboardFilterSelect
          allLabel="All divisions"
          description="Scopes every dashboard widget"
          icon={Building2Icon}
          onChange={handleDepartmentsChange}
          options={DASHBOARD_DEPARTMENT_OPTIONS}
          title="Division"
          value={filters.departments}
        />
        <DashboardDateFilter
          value={filters.range}
          onChange={handleRangeChange}
        />
      </HeaderActions>
    </>
  );
}
