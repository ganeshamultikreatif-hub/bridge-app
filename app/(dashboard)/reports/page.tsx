"use client";

import { useState } from "react";
import { ReportsView } from "@/components/reports/reports-view";
import { getDefaultReportFilters } from "@/lib/reports/data";
import type { ReportFilters } from "@/types/report";

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>(
    getDefaultReportFilters,
  );

  return <ReportsView filters={filters} onFiltersChange={setFilters} />;
}
