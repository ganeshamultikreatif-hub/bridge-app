"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DashboardFilterSelect } from "@/components/dashboard/dashboard-filter-select";
import { DashboardKpiStrip } from "@/components/dashboard/dashboard-kpi-strip";
import { HeaderActions } from "@/components/shared/header-actions";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HEADER_TOOLBAR_BUTTON,
  HEADER_TOOLBAR_GLYPH,
} from "@/config/header-toolbar";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { ORG_DIVISIONS } from "@/lib/customers/org";
import {
  Building2Icon,
  MessageIcon,
  Target,
  TrendingUp,
  UserRound,
} from "@/lib/icons";
import { getSalesKpis, listSalesLeaderboard } from "@/lib/sales/data";
import { cn } from "@/lib/utils";

export function SalesView() {
  const [departmentId, setDepartmentId] = useState("");

  const rows = useMemo(
    () => listSalesLeaderboard(departmentId),
    [departmentId],
  );
  const kpis = useMemo(() => getSalesKpis(rows), [rows]);

  const departmentOptions = useMemo(
    () =>
      ORG_DIVISIONS.map((d) => ({
        value: d.id,
        label: d.name,
        icon: Building2Icon,
      })),
    [],
  );

  const stripItems = kpis.map((kpi) => ({
    label: kpi.label,
    value: kpi.value,
    tone: "default" as const,
  }));

  return (
    <>
      <HeaderActions>
        <DashboardFilterSelect
          allLabel="All departments"
          allowClear
          description="Filter leaderboard by department"
          icon={Building2Icon}
          multiple={false}
          onChange={(values) => setDepartmentId(values[0] ?? "")}
          options={departmentOptions}
          title="Department"
          value={departmentId ? [departmentId] : []}
        />
        <Button
          type="button"
          variant="outline"
          className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
          asChild
        >
          <Link href="/leads">
            <Target data-icon="inline-start" className={HEADER_TOOLBAR_GLYPH} />
            Leads
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
          asChild
        >
          <Link href="/inbox">
            <MessageIcon
              data-icon="inline-start"
              className={HEADER_TOOLBAR_GLYPH}
            />
            Inbox
          </Link>
        </Button>
      </HeaderActions>

      <div className="flex w-full flex-col gap-3">
        <SolidSurface className="space-y-4 p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="hidden text-xl font-semibold tracking-tight md:block">
                Sales performance
              </h1>
              <p className="text-sm text-muted-foreground md:mt-1">
                Leaderboard Lead → Reply → Meeting → Closed. Jump to lead board
                or inbox.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="tabular-nums">
                {rows.length} sales
              </Badge>
              <Badge variant="secondary" className="tabular-nums">
                {kpis.find((k) => k.id === "closed")?.value ?? "0"} closed
              </Badge>
            </div>
          </div>

          <DashboardKpiStrip items={stripItems} />

          <div className="hidden gap-3 lg:grid lg:grid-cols-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.id}
                className="rounded-xl border border-border/50 bg-muted/30 px-3 py-3"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {kpi.label}
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
                  {kpi.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {kpi.hint}
                </p>
              </div>
            ))}
          </div>
        </SolidSurface>

        <SolidSurface className={cn(APP_PANEL_SURFACE, "overflow-hidden p-0")}>
          <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Leaderboard
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Ranked by closed deals
              </p>
            </div>
            <TrendingUp className="size-4 text-foreground/50" aria-hidden />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium sm:px-5">#</th>
                  <th className="px-3 py-3 font-medium">Sales</th>
                  <th className="px-3 py-3 font-medium">Department</th>
                  <th className="px-3 py-3 text-right font-medium">Lead</th>
                  <th className="px-3 py-3 text-right font-medium">Reply</th>
                  <th className="px-3 py-3 text-right font-medium">Meeting</th>
                  <th className="px-3 py-3 text-right font-medium sm:pr-5">
                    Closed
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 sm:px-5">
                      <div className="flex flex-col items-center gap-2 py-4 text-center">
                        <p className="font-medium text-sm">
                          No sales in this department
                        </p>
                        <p className="max-w-sm text-xs text-muted-foreground">
                          Assign sales owners in Settings, or switch department
                          filter.
                        </p>
                        <Link
                          href="/settings"
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Open Settings
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="px-4 py-3 tabular-nums text-muted-foreground sm:px-5">
                        {index + 1}
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-2 font-medium">
                          <span className="flex size-7 items-center justify-center rounded-lg border border-border/70 bg-muted/40">
                            <UserRound className="size-3.5" aria-hidden />
                          </span>
                          {row.name}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {row.departmentName}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {row.lead}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {row.reply}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {row.meeting}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums sm:pr-5">
                        {row.closed}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SolidSurface>
      </div>
    </>
  );
}
