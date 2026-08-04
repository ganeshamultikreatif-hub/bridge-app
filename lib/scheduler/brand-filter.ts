import type { ScheduleItem } from "@/types/schedule";

const BRAND_FILTER_STORAGE_PREFIX = "scheduler:brand-filter";

export function getScheduleBrandValue(item: ScheduleItem): string | undefined {
  return item.brandSlug ?? legacyPayloadBrand(item);
}

function legacyPayloadBrand(item: ScheduleItem): string | undefined {
  const value = item.payload?.brand;
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function parseBrandSlugsParam(value: string | undefined): string[] {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
}

export function serializeBrandSlugsParam(slugs: string[]): string {
  return slugs.join(",");
}

export function getBrandFilterStorageKey(userId: string): string {
  return `${BRAND_FILTER_STORAGE_PREFIX}:${userId}`;
}

export function readStoredBrandFilter(userId: string): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = localStorage.getItem(getBrandFilterStorageKey(userId));

  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    );
  } catch {
    return [];
  }
}

export function writeStoredBrandFilter(userId: string, slugs: string[]): void {
  localStorage.setItem(getBrandFilterStorageKey(userId), JSON.stringify(slugs));
}

export function filterSchedulesByBrand(
  items: ScheduleItem[],
  selectedSlugs: string[],
): ScheduleItem[] {
  if (selectedSlugs.length === 0) {
    return items;
  }

  return items.filter((item) => {
    const slug = getScheduleBrandValue(item);

    return slug ? selectedSlugs.includes(slug) : false;
  });
}
