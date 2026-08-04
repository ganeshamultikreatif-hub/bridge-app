import type { ReportType } from "@/config/reports";

export interface ReportFilters {
  departmentId: string;
  salesId: string;
  from: string;
  to: string;
  type: ReportType;
}

export interface ReportRow {
  id: string;
  label: string;
  department: string;
  sales: string;
  metricA: number;
  metricB: number;
  metricC: number;
  rate: number;
}

export interface ReportSummary {
  title: string;
  subtitle: string;
  columns: [string, string, string, string];
  rows: ReportRow[];
  totals: {
    metricA: number;
    metricB: number;
    metricC: number;
    rate: number;
  };
}
