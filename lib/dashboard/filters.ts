import {
  differenceInCalendarDays,
  endOfMonth,
  endOfQuarter,
  startOfMonth,
  startOfQuarter,
  subDays,
} from "date-fns";
import { DASHBOARD_DEPARTMENT_OPTIONS } from "@/config/dashboard-filters";
import { formatInputDate } from "@/lib/calendar/date-utils";
import {
  type DashboardDateRange,
  formatDashboardDateRangeLabel,
  getDefaultDashboardDateRange,
  parseDashboardDateRange,
} from "@/lib/dashboard/date-range";
import { getAppToday } from "@/lib/datetime/format";
import type { DashboardSummary, DashboardWidgetsData } from "@/types/dashboard";

function departmentIdFromLabel(label: string): string | undefined {
  return DASHBOARD_DEPARTMENT_OPTIONS.find((option) => option.label === label)
    ?.value;
}

export type DashboardPeriodPreset =
  | "this-month"
  | "last-7-days"
  | "last-30-days"
  | "this-quarter"
  | "custom";

export interface DashboardFiltersState {
  departments: string[];
  range: DashboardDateRange;
}

export function getPresetDateRange(
  preset: Exclude<DashboardPeriodPreset, "custom">,
): DashboardDateRange {
  const today = getAppToday();

  switch (preset) {
    case "last-7-days":
      return {
        from: formatInputDate(subDays(today, 6)),
        to: formatInputDate(today),
      };
    case "last-30-days":
      return {
        from: formatInputDate(subDays(today, 29)),
        to: formatInputDate(today),
      };
    case "this-quarter":
      return {
        from: formatInputDate(startOfQuarter(today)),
        to: formatInputDate(endOfQuarter(today)),
      };
    case "this-month":
    default:
      return {
        from: formatInputDate(startOfMonth(today)),
        to: formatInputDate(endOfMonth(today)),
      };
  }
}

export function matchPeriodPreset(
  range: DashboardDateRange,
): DashboardPeriodPreset {
  const presets: Array<Exclude<DashboardPeriodPreset, "custom">> = [
    "this-month",
    "last-7-days",
    "last-30-days",
    "this-quarter",
  ];

  for (const preset of presets) {
    const candidate = getPresetDateRange(preset);
    if (candidate.from === range.from && candidate.to === range.to) {
      return preset;
    }
  }

  return "custom";
}

export function parseDashboardFilters(
  searchParams: URLSearchParams,
): DashboardFiltersState {
  const departments = (searchParams.get("departments") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) =>
      DASHBOARD_DEPARTMENT_OPTIONS.some((option) => option.value === value),
    );

  // Prefer explicit from/to. Fall back to legacy `period` presets.
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;

  if (from || to) {
    return {
      departments,
      range: parseDashboardDateRange({ from, to }),
    };
  }

  const legacyPeriod = searchParams.get("period");
  if (
    legacyPeriod === "this-month" ||
    legacyPeriod === "last-7-days" ||
    legacyPeriod === "last-30-days" ||
    legacyPeriod === "this-quarter"
  ) {
    return {
      departments,
      range: getPresetDateRange(legacyPeriod),
    };
  }

  return {
    departments,
    range: getDefaultDashboardDateRange(),
  };
}

export function writeDashboardFilters(
  base: URLSearchParams,
  filters: DashboardFiltersState,
): URLSearchParams {
  const params = new URLSearchParams(base.toString());
  const defaults = getDefaultDashboardDateRange();

  params.delete("sales");
  params.delete("status");
  params.delete("period");

  if (filters.departments.length === 0) {
    params.delete("departments");
  } else {
    params.set("departments", filters.departments.join(","));
  }

  if (
    filters.range.from === defaults.from &&
    filters.range.to === defaults.to
  ) {
    params.delete("from");
    params.delete("to");
  } else {
    params.set("from", filters.range.from);
    params.set("to", filters.range.to);
  }

  return params;
}

export function countActiveDashboardFilters(
  filters: DashboardFiltersState,
): number {
  const defaults = getDefaultDashboardDateRange();
  const rangeActive =
    filters.range.from !== defaults.from || filters.range.to !== defaults.to;

  return (filters.departments.length > 0 ? 1 : 0) + (rangeActive ? 1 : 0);
}

export function getDashboardRangeLabel(range: DashboardDateRange): string {
  return formatDashboardDateRangeLabel(range);
}

function rangeFactor(range: DashboardDateRange): number {
  const days =
    differenceInCalendarDays(
      new Date(`${range.to}T00:00:00`),
      new Date(`${range.from}T00:00:00`),
    ) + 1;

  if (days <= 7) return 0.45;
  if (days <= 14) return 0.65;
  if (days <= 31) return 1;
  if (days <= 62) return 1.2;
  return 1.35;
}

function scaleTrend(
  points: DashboardWidgetsData["broadcastTrend"],
  factor: number,
) {
  return points.map((point) => ({
    ...point,
    value: Math.max(0, Math.round(point.value * factor)),
  }));
}

function scaleCount(value: number, factor: number): number {
  return Math.max(0, Math.round(value * factor));
}

function scaleRate(value: number, factor: number): number {
  const next = value * (0.96 + factor * 0.04);
  return Math.min(99.9, Math.max(0, Number(next.toFixed(1))));
}

export interface DashboardFilteredData {
  summary: DashboardSummary;
  widgets: DashboardWidgetsData;
}

/**
 * Applies global dashboard scope (division + date range) to every surface.
 */
export function applyDashboardFilters(
  summary: DashboardSummary,
  widgets: DashboardWidgetsData,
  filters: DashboardFiltersState,
): DashboardFilteredData {
  const departmentSet = new Set(filters.departments);
  const hasDepartmentFilter = departmentSet.size > 0;
  const factor = rangeFactor(filters.range);

  const departments = hasDepartmentFilter
    ? widgets.departments.filter((item) => departmentSet.has(item.id))
    : widgets.departments;

  const coverage = hasDepartmentFilter
    ? Math.max(
        0.28,
        departments.length / Math.max(widgets.departments.length, 1),
      )
    : 1;

  const scope = coverage * factor;

  const departmentLabels = new Set(
    DASHBOARD_DEPARTMENT_OPTIONS.filter((option) =>
      hasDepartmentFilter ? departmentSet.has(option.value) : true,
    ).map((option) => option.label),
  );

  const recentBroadcasts = widgets.recentBroadcasts.filter((item) => {
    if (!hasDepartmentFilter) return true;
    const id = departmentIdFromLabel(item.department);
    return id ? departmentSet.has(id) : false;
  });

  const recentLeads = widgets.recentLeads.filter((item) => {
    if (!hasDepartmentFilter) return true;
    const id = departmentIdFromLabel(item.department);
    return id ? departmentSet.has(id) : false;
  });

  const activity = widgets.activity.filter((item) => {
    if (!hasDepartmentFilter) return true;
    return [...departmentLabels].some(
      (label) => item.description.includes(label) || item.title.includes(label),
    );
  });

  return {
    summary: {
      totalCustomers: scaleCount(summary.totalCustomers, scope),
      totalDepartments: hasDepartmentFilter
        ? departments.length
        : scaleCount(summary.totalDepartments, Math.min(1, factor)),
      totalSales: scaleCount(summary.totalSales, scope),
      broadcastsThisMonth: scaleCount(summary.broadcastsThisMonth, scope),
      broadcastsToday: scaleCount(summary.broadcastsToday, scope),
      deliveryRate: scaleRate(summary.deliveryRate, scope),
      replyRate: scaleRate(summary.replyRate, scope),
    },
    widgets: {
      broadcastTrend: scaleTrend(widgets.broadcastTrend, scope),
      leadTrend: scaleTrend(widgets.leadTrend, scope),
      departments: departments.map((item) => ({
        ...item,
        broadcasts: scaleCount(item.broadcasts, factor),
        leads: scaleCount(item.leads, factor),
      })),
      activity,
      recentBroadcasts,
      recentLeads,
    },
  };
}
