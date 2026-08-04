"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { DashboardActivity } from "@/components/dashboard/dashboard-activity";
import { DashboardAiComingSoon } from "@/components/dashboard/dashboard-ai-coming-soon";
import { DashboardDepartmentPerformance } from "@/components/dashboard/dashboard-department-performance";
import { DashboardFiltersToolbar } from "@/components/dashboard/dashboard-filters-toolbar";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { DashboardKpiCard } from "@/components/dashboard/dashboard-kpi-card";
import { DashboardKpiStrip } from "@/components/dashboard/dashboard-kpi-strip";
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { DashboardRecentBroadcasts } from "@/components/dashboard/dashboard-recent-broadcasts";
import { DashboardRecentLeads } from "@/components/dashboard/dashboard-recent-leads";
import { DashboardTodaysTasks } from "@/components/dashboard/dashboard-todays-tasks";
import { DashboardTrendChart } from "@/components/dashboard/dashboard-trend-chart";
import type { DashboardWidgetVariant } from "@/components/dashboard/dashboard-widget";
import {
  DASHBOARD_WIDGET_GAP,
  DASHBOARD_WIDGET_INSET,
} from "@/config/dashboard";
import { useCurrentUser } from "@/contexts/current-user-context";
import {
  applyDashboardFilters,
  getDashboardRangeLabel,
  parseDashboardFilters,
} from "@/lib/dashboard/filters";
import {
  getDashboardSummary,
  getDashboardWidgets,
  toDashboardSummaryMetrics,
} from "@/lib/dashboard/summary";
import {
  type AppIcon,
  CheckCircle2,
  Megaphone,
  MessageIcon,
  Target,
  TrendingUp,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

const METRIC_ICONS: Record<string, AppIcon> = {
  broadcasts: Megaphone,
  delivery: CheckCircle2,
  reply: MessageIcon,
};

const METRIC_VARIANTS: Record<string, DashboardWidgetVariant> = {
  broadcasts: "tintedWarning",
  delivery: "tintedSuccess",
  reply: "tinted",
};

const STRIP_TONES = {
  up: "success",
  down: "danger",
  neutral: "default",
} as const;

function DashboardViewContent() {
  const { currentUser } = useCurrentUser();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseDashboardFilters(searchParams),
    [searchParams],
  );

  const filtered = useMemo(
    () =>
      applyDashboardFilters(
        getDashboardSummary(),
        getDashboardWidgets(),
        filters,
      ),
    [filters],
  );
  const metrics = toDashboardSummaryMetrics(filtered.summary);
  const widgets = filtered.widgets;
  const periodLabel = getDashboardRangeLabel(filters.range);

  const stripItems = metrics.map((metric) => ({
    label: metric.label.replace(" Rate", "").replace("Broadcast ", ""),
    value: metric.value,
    tone: metric.deltaTone
      ? STRIP_TONES[metric.deltaTone]
      : ("default" as const),
  }));

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <DashboardFiltersToolbar filters={filters} />

      <div
        className={cn(
          "flex w-full flex-col",
          DASHBOARD_WIDGET_GAP,
          DASHBOARD_WIDGET_INSET,
        )}
      >
        <DashboardGreeting
          username={currentUser.username}
          rangeLabel={periodLabel}
        />

        <DashboardQuickActions />

        <DashboardTodaysTasks />

        <DashboardKpiStrip items={stripItems} />

        <div
          className={cn(
            "hidden auto-rows-auto items-stretch lg:grid lg:grid-cols-3",
            DASHBOARD_WIDGET_GAP,
          )}
        >
          {metrics.map((metric) => (
            <DashboardKpiCard
              key={metric.id}
              description={metric.hint}
              icon={METRIC_ICONS[metric.id] ?? TrendingUp}
              label={metric.label}
              value={metric.value}
              variant={METRIC_VARIANTS[metric.id] ?? "glass"}
            />
          ))}
        </div>

        <div
          className={cn(
            "grid grid-cols-1 auto-rows-auto items-stretch sm:grid-cols-2 lg:grid-cols-6",
            DASHBOARD_WIDGET_GAP,
          )}
        >
          <DashboardTrendChart
            title="Broadcast Trend"
            description="Weekly campaign sends"
            points={widgets.broadcastTrend}
            color="#007AFF"
            icon={Megaphone}
            className="col-span-1 sm:col-span-1 lg:col-span-3"
          />
          <DashboardTrendChart
            title="Lead Trend"
            description="Weekly new leads"
            points={widgets.leadTrend}
            color="#30D158"
            icon={Target}
            className="col-span-1 sm:col-span-1 lg:col-span-3"
          />

          <DashboardDepartmentPerformance
            items={widgets.departments}
            className="col-span-1 sm:col-span-1 lg:col-span-3"
          />
          <DashboardActivity
            items={widgets.activity}
            className="col-span-1 sm:col-span-1 lg:col-span-3"
          />

          <DashboardRecentBroadcasts
            items={widgets.recentBroadcasts}
            className="col-span-1 sm:col-span-1 lg:col-span-3"
          />
          <DashboardRecentLeads
            items={widgets.recentLeads}
            className="col-span-1 sm:col-span-1 lg:col-span-3"
          />
        </div>

        <DashboardAiComingSoon />
      </div>
    </div>
  );
}

export function DashboardView() {
  return (
    <Suspense fallback={null}>
      <DashboardViewContent />
    </Suspense>
  );
}
