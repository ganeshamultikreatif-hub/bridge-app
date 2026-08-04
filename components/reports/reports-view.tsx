"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { DashboardDateFilter } from "@/components/dashboard/dashboard-date-filter";
import { DashboardFilterSelect } from "@/components/dashboard/dashboard-filter-select";
import { HeaderActions } from "@/components/shared/header-actions";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Button } from "@/components/ui/button";
import {
  HEADER_TOOLBAR_BUTTON,
  HEADER_TOOLBAR_GLYPH,
} from "@/config/header-toolbar";
import { REPORT_TYPE_OPTIONS, type ReportType } from "@/config/reports";
import {
  APP_PANEL_SURFACE,
  APP_TOOLBAR_SURFACE,
} from "@/config/shared-surfaces";
import {
  listSalesForDivision,
  ORG_DIVISIONS,
  ORG_SALES,
} from "@/lib/customers/org";
import type { DashboardDateRange } from "@/lib/dashboard/date-range";
import { Building2Icon, Download, FileText, UserRound } from "@/lib/icons";
import { buildReportSummary } from "@/lib/reports/data";
import { downloadExcel, openPdfPrint } from "@/lib/reports/export";
import { cn } from "@/lib/utils";
import type { ReportFilters } from "@/types/report";

interface ReportsViewProps {
  filters: ReportFilters;
  onFiltersChange: (next: ReportFilters) => void;
}

export function ReportsView({ filters, onFiltersChange }: ReportsViewProps) {
  const summary = useMemo(() => buildReportSummary(filters), [filters]);

  const departmentOptions = useMemo(
    () =>
      ORG_DIVISIONS.map((d) => ({
        value: d.id,
        label: d.name,
        icon: Building2Icon,
      })),
    [],
  );

  const salesOptions = useMemo(() => {
    const pool = filters.departmentId
      ? listSalesForDivision(filters.departmentId)
      : ORG_SALES;
    return pool.map((s) => ({
      value: s.id,
      label: s.name,
      icon: UserRound,
    }));
  }, [filters.departmentId]);

  function setType(type: ReportType) {
    onFiltersChange({ ...filters, type });
  }

  function setDepartment(values: string[]) {
    const departmentId = values[0] ?? "";
    let salesId = filters.salesId;
    if (salesId) {
      const pool = departmentId
        ? listSalesForDivision(departmentId)
        : ORG_SALES;
      if (!pool.some((s) => s.id === salesId)) {
        salesId = "";
      }
    }
    onFiltersChange({ ...filters, departmentId, salesId });
  }

  function setSales(values: string[]) {
    onFiltersChange({ ...filters, salesId: values[0] ?? "" });
  }

  function setRange(range: DashboardDateRange) {
    onFiltersChange({ ...filters, from: range.from, to: range.to });
  }

  function handleExcel() {
    downloadExcel(summary);
    toast.success("Excel exported", {
      description: `${summary.rows.length} rows · ${summary.title}`,
    });
  }

  function handlePdf() {
    openPdfPrint(summary);
    toast.message("Print dialog opened", {
      description: "Choose Save as PDF in the print dialog.",
    });
  }

  const exportActions = (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
        onClick={handleExcel}
      >
        <Download data-icon="inline-start" className={HEADER_TOOLBAR_GLYPH} />
        Excel
      </Button>
      <Button
        type="button"
        variant="outline"
        className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
        onClick={handlePdf}
      >
        <FileText data-icon="inline-start" className={HEADER_TOOLBAR_GLYPH} />
        PDF
      </Button>
    </>
  );

  return (
    <>
      <HeaderActions viewport="mobile">{exportActions}</HeaderActions>
      <HeaderActions>{exportActions}</HeaderActions>

      <div className="flex min-w-0 flex-1 flex-col gap-3 md:gap-5">
        <div className={cn(APP_TOOLBAR_SURFACE, "flex flex-col gap-2")}>
          <div className="flex flex-wrap gap-1 rounded-full bg-muted/50 p-1">
            {REPORT_TYPE_OPTIONS.map((option) => {
              const active = filters.type === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={cn(
                    "min-w-0 flex-1 rounded-full px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="sm:hidden">{option.shortLabel}</span>
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DashboardFilterSelect
              allLabel="All departments"
              allowClear
              description="Filter by department"
              icon={Building2Icon}
              multiple={false}
              onChange={setDepartment}
              options={departmentOptions}
              title="Department"
              value={filters.departmentId ? [filters.departmentId] : []}
            />
            <DashboardFilterSelect
              allLabel="All sales"
              allowClear
              description="Filter by sales person"
              icon={UserRound}
              multiple={false}
              onChange={setSales}
              options={salesOptions}
              title="Sales"
              value={filters.salesId ? [filters.salesId] : []}
            />
            <DashboardDateFilter
              value={{ from: filters.from, to: filters.to }}
              onChange={setRange}
            />
          </div>
        </div>

        <SolidSurface className={cn(APP_PANEL_SURFACE, "overflow-hidden p-0")}>
          <div className="border-b border-border/60 px-4 py-4 sm:px-5">
            <h2 className="text-base font-semibold tracking-tight">
              {summary.title}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {summary.subtitle}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium sm:px-5">Label</th>
                  <th className="px-3 py-3 font-medium">Department</th>
                  <th className="px-3 py-3 font-medium">Sales</th>
                  {summary.columns.map((col) => (
                    <th key={col} className="px-3 py-3 font-medium text-right">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary.rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-muted-foreground sm:px-5"
                    >
                      No rows for this filter combination.
                    </td>
                  </tr>
                ) : (
                  summary.rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium sm:px-5">
                        {row.label}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {row.department}
                      </td>
                      <td className="px-3 py-3">{row.sales}</td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {row.metricA.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {row.metricB.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {row.metricC.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {row.rate}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {summary.rows.length > 0 ? (
                <tfoot>
                  <tr className="bg-muted/20 text-sm font-semibold">
                    <td className="px-4 py-3 sm:px-5">Total</td>
                    <td className="px-3 py-3" />
                    <td className="px-3 py-3" />
                    <td className="px-3 py-3 text-right tabular-nums">
                      {summary.totals.metricA.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {summary.totals.metricB.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {summary.totals.metricC.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {summary.totals.rate}%
                    </td>
                  </tr>
                </tfoot>
              ) : null}
            </table>
          </div>
        </SolidSurface>
      </div>
    </>
  );
}
