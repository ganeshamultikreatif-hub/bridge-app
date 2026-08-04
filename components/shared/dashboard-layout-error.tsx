"use client";

import { RouteErrorView } from "@/components/shared/route-error-view";

interface DashboardLayoutErrorProps {
  digest?: string | undefined;
}

export function DashboardLayoutError({ digest }: DashboardLayoutErrorProps) {
  return (
    <RouteErrorView
      description="Dashboard gagal dimuat. Kemungkinan koneksi database bermasalah — coba muat ulang atau hubungi admin."
      digest={digest}
      title="Gagal memuat dashboard"
    />
  );
}
