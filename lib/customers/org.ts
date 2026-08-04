import type { OrgDivision, OrgProduct, OrgSales } from "@/types/customer";

/** Division → Sales → Product org tree (demo). */
export const ORG_DIVISIONS: OrgDivision[] = [
  { id: "marketing", name: "Marketing" },
  { id: "sales", name: "Sales" },
  { id: "cs", name: "Customer Success" },
  { id: "ops", name: "Operations" },
];

export const ORG_SALES: OrgSales[] = [
  { id: "rina", name: "Rina", divisionId: "sales" },
  { id: "andi", name: "Andi", divisionId: "sales" },
  { id: "bima", name: "Bima", divisionId: "marketing" },
  { id: "sari", name: "Sari", divisionId: "marketing" },
  { id: "maya", name: "Maya", divisionId: "cs" },
  { id: "tono", name: "Tono", divisionId: "cs" },
  { id: "dimas", name: "Dimas", divisionId: "ops" },
];

export const ORG_PRODUCTS: OrgProduct[] = [
  {
    id: "prod_enterprise",
    name: "Bridge Enterprise",
    salesId: "rina",
    divisionId: "sales",
  },
  {
    id: "prod_smb",
    name: "Bridge SMB",
    salesId: "andi",
    divisionId: "sales",
  },
  {
    id: "prod_campaign",
    name: "Campaign Suite",
    salesId: "bima",
    divisionId: "marketing",
  },
  {
    id: "prod_ads",
    name: "Ads Accelerator",
    salesId: "sari",
    divisionId: "marketing",
  },
  {
    id: "prod_onboard",
    name: "Onboarding Care",
    salesId: "maya",
    divisionId: "cs",
  },
  {
    id: "prod_renew",
    name: "Renewal Guard",
    salesId: "tono",
    divisionId: "cs",
  },
  {
    id: "prod_ops",
    name: "Ops Digest",
    salesId: "dimas",
    divisionId: "ops",
  },
];

export function getDivisionById(id: string): OrgDivision | undefined {
  return ORG_DIVISIONS.find((item) => item.id === id);
}

export function getSalesById(id: string): OrgSales | undefined {
  return ORG_SALES.find((item) => item.id === id);
}

export function getProductById(id: string): OrgProduct | undefined {
  return ORG_PRODUCTS.find((item) => item.id === id);
}

export function listSalesForDivision(divisionId: string): OrgSales[] {
  return ORG_SALES.filter((item) => item.divisionId === divisionId);
}

export function listProductsForSales(salesId: string): OrgProduct[] {
  return ORG_PRODUCTS.filter((item) => item.salesId === salesId);
}

export function listProductsForDivision(divisionId: string): OrgProduct[] {
  return ORG_PRODUCTS.filter((item) => item.divisionId === divisionId);
}
