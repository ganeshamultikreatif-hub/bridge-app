import {
  LEAD_STATUS_DESCRIPTION,
  LEAD_STATUS_LABEL,
  LEAD_STATUS_ORDER,
} from "@/config/leads";
import { ORG_DIVISIONS, ORG_SALES } from "@/lib/customers/org";
import type { LeadCard, LeadColumnMeta } from "@/types/lead";

export function getStatusColumns(): LeadColumnMeta[] {
  return LEAD_STATUS_ORDER.map((id) => ({
    id,
    label: LEAD_STATUS_LABEL[id],
    description: LEAD_STATUS_DESCRIPTION[id],
  }));
}

export function getSalesColumns(): LeadColumnMeta[] {
  return ORG_SALES.map((sales) => ({
    id: sales.id,
    label: sales.name,
    description:
      ORG_DIVISIONS.find((d) => d.id === sales.divisionId)?.name ?? "",
  }));
}

export function getDepartmentColumns(): LeadColumnMeta[] {
  return ORG_DIVISIONS.map((division) => ({
    id: division.id,
    label: division.name,
    description: `${ORG_SALES.filter((s) => s.divisionId === division.id).length} sales`,
  }));
}

export function groupLeadsByColumn(
  items: LeadCard[],
  groupBy: "status" | "sales" | "department",
): Map<string, LeadCard[]> {
  const map = new Map<string, LeadCard[]>();

  for (const item of items) {
    const key =
      groupBy === "status"
        ? item.status
        : groupBy === "sales"
          ? item.salesId
          : item.departmentId;
    const bucket = map.get(key) ?? [];
    bucket.push(item);
    map.set(key, bucket);
  }

  return map;
}

export function defaultSalesForDepartment(departmentId: string) {
  const sales = ORG_SALES.find((item) => item.divisionId === departmentId);
  const division = ORG_DIVISIONS.find((item) => item.id === departmentId);
  if (!sales || !division) return null;
  return {
    salesId: sales.id,
    salesName: sales.name,
    departmentId: division.id,
    departmentName: division.name,
  };
}

export function salesMeta(salesId: string) {
  const sales = ORG_SALES.find((item) => item.id === salesId);
  if (!sales) return null;
  const division = ORG_DIVISIONS.find((item) => item.id === sales.divisionId);
  return {
    salesId: sales.id,
    salesName: sales.name,
    departmentId: sales.divisionId,
    departmentName: division?.name ?? sales.divisionId,
  };
}
