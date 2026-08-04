import { getBrandLogoSrc } from "@/config/brands";

export function normalizeBrandLogoUrl(
  logoUrl: string | null | undefined,
): string | null {
  if (!logoUrl) {
    return null;
  }

  const trimmed = logoUrl.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveBrandLogoUrl(
  slug: string,
  logoUrl?: string | null,
): string | null {
  const fromDatabase = normalizeBrandLogoUrl(logoUrl);

  if (fromDatabase) {
    return fromDatabase;
  }

  return getBrandLogoSrc(slug) ?? null;
}
