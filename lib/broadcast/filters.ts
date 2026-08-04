import type { BroadcastCampaign, BroadcastStatus } from "@/types/broadcast";

export interface BroadcastFiltersState {
  q: string;
  departments: string[];
  statuses: BroadcastStatus[];
}

export function parseBroadcastFilters(
  searchParams: URLSearchParams,
): BroadcastFiltersState {
  const q = searchParams.get("q")?.trim() ?? "";
  const departments = (searchParams.get("departments") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const statuses = (searchParams.get("status") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean) as BroadcastStatus[];

  return { q, departments, statuses };
}

export function writeBroadcastFilters(
  base: URLSearchParams,
  filters: BroadcastFiltersState,
): URLSearchParams {
  const params = new URLSearchParams(base.toString());

  if (!filters.q) params.delete("q");
  else params.set("q", filters.q);

  if (filters.departments.length === 0) params.delete("departments");
  else params.set("departments", filters.departments.join(","));

  if (filters.statuses.length === 0) params.delete("status");
  else params.set("status", filters.statuses.join(","));

  return params;
}

export function filterBroadcasts(
  items: BroadcastCampaign[],
  filters: BroadcastFiltersState,
): BroadcastCampaign[] {
  const query = filters.q.toLowerCase();
  const departmentSet = new Set(filters.departments);
  const statusSet = new Set(filters.statuses);

  return items.filter((item) => {
    if (departmentSet.size > 0 && !departmentSet.has(item.departmentId)) {
      return false;
    }
    if (statusSet.size > 0 && !statusSet.has(item.status)) {
      return false;
    }
    if (!query) return true;

    const haystack = [
      item.name,
      item.departmentName,
      item.audienceName,
      item.templateName,
      item.status,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function formatMetric(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function ratePercent(part: number, whole: number): string {
  if (whole <= 0) return "—";
  return `${((part / whole) * 100).toFixed(1)}%`;
}
