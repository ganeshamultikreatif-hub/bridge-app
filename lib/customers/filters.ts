import type { Customer, CustomerTag } from "@/types/customer";

export interface CustomerFiltersState {
  q: string;
  divisions: string[];
  sales: string[];
  products: string[];
  tags: CustomerTag[];
}

export function parseCustomerFilters(
  searchParams: URLSearchParams,
): CustomerFiltersState {
  const q = searchParams.get("q")?.trim() ?? "";
  const divisions = (searchParams.get("divisions") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const sales = (searchParams.get("sales") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const products = (searchParams.get("products") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const tags = (searchParams.get("tags") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean) as CustomerTag[];

  return { q, divisions, sales, products, tags };
}

export function writeCustomerFilters(
  base: URLSearchParams,
  filters: CustomerFiltersState,
): URLSearchParams {
  const params = new URLSearchParams(base.toString());

  // Drop legacy keys
  params.delete("departments");

  if (!filters.q) params.delete("q");
  else params.set("q", filters.q);

  if (filters.divisions.length === 0) params.delete("divisions");
  else params.set("divisions", filters.divisions.join(","));

  if (filters.sales.length === 0) params.delete("sales");
  else params.set("sales", filters.sales.join(","));

  if (filters.products.length === 0) params.delete("products");
  else params.set("products", filters.products.join(","));

  if (filters.tags.length === 0) params.delete("tags");
  else params.set("tags", filters.tags.join(","));

  return params;
}

export function countActiveCustomerFilters(
  filters: CustomerFiltersState,
): number {
  return (
    (filters.q ? 1 : 0) +
    (filters.divisions.length > 0 ? 1 : 0) +
    (filters.sales.length > 0 ? 1 : 0) +
    (filters.products.length > 0 ? 1 : 0) +
    (filters.tags.length > 0 ? 1 : 0)
  );
}

export function filterCustomers(
  items: Customer[],
  filters: CustomerFiltersState,
): Customer[] {
  const query = filters.q.toLowerCase();
  const divisionSet = new Set(filters.divisions);
  const salesSet = new Set(filters.sales);
  const productSet = new Set(filters.products);
  const tagSet = new Set(filters.tags);

  return items.filter((item) => {
    if (divisionSet.size > 0) {
      const hit = item.memberships.some((m) => divisionSet.has(m.divisionId));
      if (!hit) return false;
    }
    if (salesSet.size > 0) {
      const hit = item.memberships.some((m) => salesSet.has(m.salesId));
      if (!hit) return false;
    }
    if (productSet.size > 0) {
      const hit = item.memberships.some((m) => productSet.has(m.productId));
      if (!hit) return false;
    }
    if (tagSet.size > 0 && !item.tags.some((tag) => tagSet.has(tag))) {
      return false;
    }
    if (!query) return true;

    const haystack = [
      item.companyName,
      item.picName,
      item.jobTitle,
      item.email,
      item.whatsapp,
      ...item.memberships.flatMap((m) => [
        m.divisionName,
        m.salesName,
        m.productName,
      ]),
      ...item.tags,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function customersToCsv(items: Customer[]): string {
  const header = [
    "WhatsApp",
    "Name",
    "Email",
    "Company",
    "Job Title",
    "Products",
    "Divisions",
    "Sales",
    "Tags",
    "Last Activity",
  ];

  const rows = items.map((item) =>
    [
      item.whatsapp,
      item.picName ?? "",
      item.email ?? "",
      item.companyName ?? "",
      item.jobTitle ?? "",
      item.memberships.map((m) => m.productName).join("|"),
      item.memberships.map((m) => m.divisionName).join("|"),
      item.memberships.map((m) => m.salesName).join("|"),
      item.tags.join("|"),
      item.lastActivityLabel,
    ]
      .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
      .join(","),
  );

  return [header.join(","), ...rows].join("\n");
}
