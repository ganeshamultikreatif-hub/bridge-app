"use client";

import { DashboardDateFilter } from "@/components/dashboard/dashboard-date-filter";
import { FilterOptionRow } from "@/components/shared/filter-option-row";
import { MobileFilterClearAllButton } from "@/components/shared/mobile-filter-clear-all-button";
import { MobileFilterControlSlot } from "@/components/shared/mobile-filter-control-slot";
import { MobileFilterDrawerBody } from "@/components/shared/mobile-filter-drawer-body";
import { MobileFilterSection } from "@/components/shared/mobile-filter-section";
import { DASHBOARD_DEPARTMENT_OPTIONS } from "@/config/dashboard-filters";
import type { DashboardDateRange } from "@/lib/dashboard/date-range";
import type { DashboardFiltersState } from "@/lib/dashboard/filters";
import { Building2Icon } from "@/lib/icons";

interface DashboardMobileFiltersProps {
  filters: DashboardFiltersState;
  hasActiveFilters: boolean;
  onDepartmentsChange: (values: string[]) => void;
  onRangeChange: (range: DashboardDateRange) => void;
  onResetFilters: () => void;
}

export function DashboardMobileFilters({
  filters,
  hasActiveFilters,
  onDepartmentsChange,
  onRangeChange,
  onResetFilters,
}: DashboardMobileFiltersProps) {
  function toggleMulti(
    current: string[],
    value: string,
    onChange: (values: string[]) => void,
  ) {
    if (current.includes(value)) {
      onChange(current.filter((item) => item !== value));
      return;
    }
    onChange([...current, value]);
  }

  return (
    <MobileFilterDrawerBody>
      <MobileFilterSection title="Division">
        <div className="space-y-1 p-1">
          <FilterOptionRow
            active={filters.departments.length === 0}
            description="Applies to all widgets"
            icon={<Building2Icon aria-hidden className="size-4" />}
            onClick={() => onDepartmentsChange([])}
            title="All divisions"
          />
          <div className="px-2 py-1">
            <div className="h-px bg-border" />
          </div>
          {DASHBOARD_DEPARTMENT_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <FilterOptionRow
                active={filters.departments.includes(option.value)}
                description={option.description}
                icon={<Icon aria-hidden className="size-4" />}
                key={option.value}
                onClick={() =>
                  toggleMulti(
                    filters.departments,
                    option.value,
                    onDepartmentsChange,
                  )
                }
                title={option.label}
              />
            );
          })}
        </div>
      </MobileFilterSection>

      <MobileFilterSection contentClassName="p-3" title="Date">
        <MobileFilterControlSlot>
          <DashboardDateFilter
            value={filters.range}
            onChange={onRangeChange}
            className="w-full min-w-0"
          />
        </MobileFilterControlSlot>
      </MobileFilterSection>

      <MobileFilterClearAllButton
        disabled={!hasActiveFilters}
        onClick={onResetFilters}
      />
    </MobileFilterDrawerBody>
  );
}
