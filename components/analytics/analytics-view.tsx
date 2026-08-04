"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardDateFilter } from "@/components/dashboard/dashboard-date-filter";
import { DashboardFilterSelect } from "@/components/dashboard/dashboard-filter-select";
import { DashboardKpiStrip } from "@/components/dashboard/dashboard-kpi-strip";
import {
  HeaderActions,
  HeaderActionsBadge,
} from "@/components/shared/header-actions";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Badge } from "@/components/ui/badge";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { useDivisionScope } from "@/contexts/division-scope-context";
import {
  type AnalyticsFilters,
  getAnalyticsHighlights,
  getAnalyticsKpis,
  getAnalyticsTrend,
  getDefaultAnalyticsFilters,
  getDepartmentClosedTargets,
} from "@/lib/analytics/data";
import { ORG_DIVISIONS } from "@/lib/customers/org";
import type { DashboardDateRange } from "@/lib/dashboard/date-range";
import {
  BarChart3,
  Building2Icon,
  CheckCircle2,
  Clock,
  Flag,
  Megaphone,
  MessageIcon,
  Target,
  TrendingUp,
  UserRound,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

const HIGHLIGHT_ICONS = {
  campaign: Megaphone,
  dept: Building2Icon,
  sales: UserRound,
  response: Clock,
  cta: Flag,
} as const;

export function AnalyticsView() {
  const { divisionId } = useDivisionScope();
  const [filters, setFilters] = useState<AnalyticsFilters>(() =>
    getDefaultAnalyticsFilters(),
  );

  useEffect(() => {
    setFilters((current) =>
      current.departmentId === divisionId
        ? current
        : { ...current, departmentId: divisionId },
    );
  }, [divisionId]);

  const kpis = useMemo(() => getAnalyticsKpis(filters), [filters]);
  const trend = useMemo(() => getAnalyticsTrend(filters), [filters]);
  const highlights = useMemo(() => getAnalyticsHighlights(filters), [filters]);
  const closedTargets = useMemo(
    () => getDepartmentClosedTargets(filters),
    [filters],
  );

  const departmentOptions = useMemo(
    () =>
      ORG_DIVISIONS.map((d) => ({
        value: d.id,
        label: d.name,
        icon: Building2Icon,
      })),
    [],
  );

  const activeFilterCount =
    (filters.departmentId ? 1 : 0) +
    (filters.from !== getDefaultAnalyticsFilters().from ||
    filters.to !== getDefaultAnalyticsFilters().to
      ? 1
      : 0);

  const maxTrend = Math.max(...trend.map((p) => p.value), 1);

  function setDepartment(values: string[]) {
    setFilters((prev) => ({ ...prev, departmentId: values[0] ?? "" }));
  }

  function setRange(range: DashboardDateRange) {
    setFilters((prev) => ({ ...prev, from: range.from, to: range.to }));
  }

  const stripItems = kpis.map((kpi) => ({
    label: kpi.label,
    value: kpi.value,
    tone:
      kpi.id === "conversion" || kpi.id === "delivery"
        ? ("success" as const)
        : ("default" as const),
  }));

  return (
    <>
      <HeaderActionsBadge count={activeFilterCount} />
      <HeaderActions>
        <DashboardFilterSelect
          allLabel="All departments"
          allowClear
          description="Scope analytics by department"
          icon={Building2Icon}
          multiple={false}
          onChange={setDepartment}
          options={departmentOptions}
          title="Department"
          value={filters.departmentId ? [filters.departmentId] : []}
        />
        <DashboardDateFilter
          value={{ from: filters.from, to: filters.to }}
          onChange={setRange}
        />
      </HeaderActions>

      <div className="flex w-full flex-col gap-3">
        <SolidSurface className="space-y-4 p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="hidden text-xl font-semibold tracking-tight md:block">
                Analytics
              </h1>
              <p className="text-sm text-muted-foreground md:mt-1">
                Delivery, read, reply, conversion · department closed vs target.
              </p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Mock period
            </Badge>
          </div>

          <DashboardKpiStrip items={stripItems} />

          <div className="hidden gap-3 lg:grid lg:grid-cols-4">
            {kpis.map((kpi) => {
              const Icon =
                kpi.id === "delivery"
                  ? CheckCircle2
                  : kpi.id === "read"
                    ? BarChart3
                    : kpi.id === "reply"
                      ? MessageIcon
                      : Target;
              return (
                <div
                  key={kpi.id}
                  className="rounded-xl border border-border/50 bg-muted/30 px-3 py-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {kpi.label}
                    </p>
                    <Icon className="size-4 text-foreground/50" aria-hidden />
                  </div>
                  <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
                    {kpi.value}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {kpi.hint}
                  </p>
                </div>
              );
            })}
          </div>
        </SolidSurface>

        <div className="grid gap-3 lg:grid-cols-5">
          <SolidSurface
            className={cn(APP_PANEL_SURFACE, "p-4 md:p-5 lg:col-span-3")}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold tracking-tight">
                  Engagement trend
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Weekly replies (mock)
                </p>
              </div>
              <TrendingUp className="size-4 text-foreground/50" aria-hidden />
            </div>

            <div className="mt-6 flex h-40 items-end gap-2 sm:gap-3">
              {trend.map((point) => {
                const height = Math.max((point.value / maxTrend) * 100, 8);
                return (
                  <div
                    key={point.label}
                    className="flex min-w-0 flex-1 flex-col items-center gap-2"
                  >
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {point.value}
                    </span>
                    <div className="flex h-28 w-full items-end justify-center">
                      <div
                        className="w-full max-w-10 rounded-t-lg bg-[#007AFF]/85 dark:bg-[#0A84FF]/90"
                        style={{ height: `${height}%` }}
                        title={`${point.label}: ${point.value}`}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </SolidSurface>

          <SolidSurface
            className={cn(APP_PANEL_SURFACE, "p-4 md:p-5 lg:col-span-2")}
          >
            <h2 className="text-base font-semibold tracking-tight">
              Highlights
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Top signals this period
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {highlights.map((item) => {
                const Icon =
                  HIGHLIGHT_ICONS[item.id as keyof typeof HIGHLIGHT_ICONS] ??
                  Flag;
                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl border border-border/40 bg-muted/20 px-3 py-2.5"
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-card">
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="truncate font-medium text-sm">
                        {item.value}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </SolidSurface>
        </div>

        <SolidSurface className={cn(APP_PANEL_SURFACE, "p-4 md:p-5")}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Closed vs target
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                By department only · attainment %
              </p>
            </div>
            <Target className="size-4 text-foreground/50" aria-hidden />
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {closedTargets.map((row) => {
              const width = Math.min(row.attainment, 100);
              const over = row.attainment >= 100;
              return (
                <li key={row.id} className="rounded-xl px-1 py-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm">{row.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {row.closed} closed · target {row.target}
                      </p>
                    </div>
                    <Badge
                      variant={over ? "default" : "secondary"}
                      className="shrink-0 tabular-nums"
                    >
                      {row.attainment}%
                    </Badge>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/8 dark:bg-white/10">
                    <div
                      className={cn(
                        "h-full rounded-full transition-[width]",
                        over ? "bg-emerald-500" : "bg-[#007AFF]",
                      )}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </SolidSurface>
      </div>
    </>
  );
}
