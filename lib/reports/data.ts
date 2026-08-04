import {
  DEFAULT_REPORT_TYPE,
  REPORT_TYPE_OPTIONS,
  type ReportType,
} from "@/config/reports";
import { ORG_DIVISIONS, ORG_SALES } from "@/lib/customers/org";
import {
  type DashboardDateRange,
  getDefaultDashboardDateRange,
} from "@/lib/dashboard/date-range";
import type { ReportFilters, ReportRow, ReportSummary } from "@/types/report";

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seededMetric(seed: string, min: number, max: number): number {
  const value = hashSeed(seed);
  return min + (value % (max - min + 1));
}

function columnLabels(type: ReportType): [string, string, string, string] {
  switch (type) {
    case "broadcast":
      return ["Sent", "Delivered", "Read", "Reply rate"];
    case "leads":
      return ["New leads", "Qualified", "Won", "Win rate"];
    case "sales":
      return ["Assigned", "Replied", "Closed", "Close rate"];
    case "delivery":
      return ["Queued", "Delivered", "Failed", "Delivery rate"];
  }
}

function buildRows(
  filters: ReportFilters,
  range: DashboardDateRange,
): ReportRow[] {
  const departments = filters.departmentId
    ? ORG_DIVISIONS.filter((d) => d.id === filters.departmentId)
    : ORG_DIVISIONS;

  const salesPool = filters.salesId
    ? ORG_SALES.filter((s) => s.id === filters.salesId)
    : ORG_SALES.filter((s) => departments.some((d) => d.id === s.divisionId));

  const typeMeta = REPORT_TYPE_OPTIONS.find((o) => o.value === filters.type);

  return salesPool.map((sales) => {
    const dept =
      ORG_DIVISIONS.find((d) => d.id === sales.divisionId)?.name ?? "—";
    const seed = `${filters.type}:${sales.id}:${range.from}:${range.to}`;
    const metricA = seededMetric(`${seed}:a`, 40, 420);
    const metricB = seededMetric(`${seed}:b`, 20, metricA);
    const metricC = seededMetric(`${seed}:c`, 5, metricB);
    const rate = Math.round((metricC / Math.max(metricA, 1)) * 1000) / 10;

    return {
      id: `${filters.type}-${sales.id}`,
      label: `${typeMeta?.shortLabel ?? "Report"} · ${sales.name}`,
      department: dept,
      sales: sales.name,
      metricA,
      metricB,
      metricC,
      rate,
    };
  });
}

export function getDefaultReportFilters(): ReportFilters {
  const range = getDefaultDashboardDateRange();
  return {
    departmentId: "",
    salesId: "",
    from: range.from,
    to: range.to,
    type: DEFAULT_REPORT_TYPE,
  };
}

export function buildReportSummary(filters: ReportFilters): ReportSummary {
  const typeMeta = REPORT_TYPE_OPTIONS.find((o) => o.value === filters.type);
  const rows = buildRows(filters, { from: filters.from, to: filters.to });
  const totals = rows.reduce(
    (acc, row) => ({
      metricA: acc.metricA + row.metricA,
      metricB: acc.metricB + row.metricB,
      metricC: acc.metricC + row.metricC,
      rate: 0,
    }),
    { metricA: 0, metricB: 0, metricC: 0, rate: 0 },
  );
  totals.rate =
    Math.round((totals.metricC / Math.max(totals.metricA, 1)) * 1000) / 10;

  const deptLabel = filters.departmentId
    ? ORG_DIVISIONS.find((d) => d.id === filters.departmentId)?.name
    : "All departments";
  const salesLabel = filters.salesId
    ? ORG_SALES.find((s) => s.id === filters.salesId)?.name
    : "All sales";

  return {
    title: typeMeta?.label ?? "Report",
    subtitle: `${deptLabel} · ${salesLabel} · ${filters.from} → ${filters.to}`,
    columns: columnLabels(filters.type),
    rows,
    totals,
  };
}
