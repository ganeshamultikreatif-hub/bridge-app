import { ORG_DIVISIONS, ORG_SALES } from "@/lib/customers/org";
import { getDefaultDashboardDateRange } from "@/lib/dashboard/date-range";

export interface AnalyticsFilters {
  departmentId: string;
  from: string;
  to: string;
}

export interface AnalyticsKpi {
  id: string;
  label: string;
  value: string;
  hint: string;
}

export interface AnalyticsTrendPoint {
  label: string;
  value: number;
}

export interface AnalyticsHighlight {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface DepartmentClosedTarget {
  id: string;
  name: string;
  closed: number;
  target: number;
  attainment: number;
}

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seeded(seed: string, min: number, max: number): number {
  return min + (hashSeed(seed) % (max - min + 1));
}

export function getDefaultAnalyticsFilters(): AnalyticsFilters {
  const range = getDefaultDashboardDateRange();
  return {
    departmentId: "",
    from: range.from,
    to: range.to,
  };
}

function scopeSeed(filters: AnalyticsFilters): string {
  return `${filters.departmentId || "all"}:${filters.from}:${filters.to}`;
}

export function getAnalyticsKpis(filters: AnalyticsFilters): AnalyticsKpi[] {
  const seed = scopeSeed(filters);
  const delivery = seeded(`${seed}:delivery`, 88, 98);
  const read = seeded(`${seed}:read`, 62, Math.min(delivery - 2, 86));
  const reply = seeded(`${seed}:reply`, 18, Math.min(read - 8, 42));
  const conversion = seeded(`${seed}:conv`, 6, Math.min(reply - 2, 22));

  return [
    {
      id: "delivery",
      label: "Delivery",
      value: `${delivery}%`,
      hint: "Messages delivered",
    },
    {
      id: "read",
      label: "Read",
      value: `${read}%`,
      hint: "Opened after delivery",
    },
    {
      id: "reply",
      label: "Reply",
      value: `${reply}%`,
      hint: "Customer replies",
    },
    {
      id: "conversion",
      label: "Conversion",
      value: `${conversion}%`,
      hint: "Closed from replies",
    },
  ];
}

export function getAnalyticsTrend(
  filters: AnalyticsFilters,
): AnalyticsTrendPoint[] {
  const seed = scopeSeed(filters);
  const labels = ["W1", "W2", "W3", "W4", "W5", "W6"];
  return labels.map((label, index) => ({
    label,
    value: seeded(`${seed}:trend:${index}`, 40 + index * 4, 120 + index * 8),
  }));
}

export function getAnalyticsHighlights(
  filters: AnalyticsFilters,
): AnalyticsHighlight[] {
  const seed = scopeSeed(filters);
  const departments = filters.departmentId
    ? ORG_DIVISIONS.filter((d) => d.id === filters.departmentId)
    : ORG_DIVISIONS;
  const salesPool = filters.departmentId
    ? ORG_SALES.filter((s) => s.divisionId === filters.departmentId)
    : ORG_SALES;

  const bestDept =
    departments[
      seeded(`${seed}:bestdept`, 0, Math.max(departments.length - 1, 0))
    ]?.name ?? "—";
  const bestSales =
    salesPool[seeded(`${seed}:bestsales`, 0, Math.max(salesPool.length - 1, 0))]
      ?.name ?? "—";
  const responseMins = seeded(`${seed}:resp`, 4, 28);
  const campaigns = [
    "Promo Q2 Awareness",
    "Demo Follow-up Wave",
    "Onboarding Checklist",
    "Renewal Guard Soft",
  ];
  const ctas = ["Book demo", "Reply YES", "Open checklist", "Claim offer"];

  return [
    {
      id: "campaign",
      label: "Top campaign",
      value: campaigns[seeded(`${seed}:camp`, 0, campaigns.length - 1)]!,
      detail: "Highest reply + conversion",
    },
    {
      id: "dept",
      label: "Best department",
      value: bestDept,
      detail: "By conversion rate",
    },
    {
      id: "sales",
      label: "Best sales",
      value: bestSales,
      detail: "Most closed deals",
    },
    {
      id: "response",
      label: "Avg response time",
      value: `${responseMins} min`,
      detail: "First agent reply",
    },
    {
      id: "cta",
      label: "Top CTA",
      value: ctas[seeded(`${seed}:cta`, 0, ctas.length - 1)]!,
      detail: "Highest click-through",
    },
  ];
}

/** Closed vs target by department only — no per-sales targets. */
export function getDepartmentClosedTargets(
  filters: AnalyticsFilters,
): DepartmentClosedTarget[] {
  const seed = scopeSeed(filters);
  const departments = filters.departmentId
    ? ORG_DIVISIONS.filter((d) => d.id === filters.departmentId)
    : ORG_DIVISIONS;

  return departments.map((dept) => {
    const target = seeded(`${seed}:${dept.id}:target`, 20, 80);
    const closed = seeded(`${seed}:${dept.id}:closed`, 8, target + 12);
    const attainment = Math.round((closed / Math.max(target, 1)) * 1000) / 10;
    return {
      id: dept.id,
      name: dept.name,
      closed,
      target,
      attainment,
    };
  });
}
