import { resolveBrandLogoUrl } from "@/lib/brands/logo";
import type { AppBrand, BrandOption } from "@/types/brand";

export function mapBrandToOption(brand: AppBrand): BrandOption {
  return {
    value: brand.slug,
    label: brand.name,
    logoSrc: resolveBrandLogoUrl(brand.slug, brand.logoUrl),
  };
}

export function mapBrandsToOptions(brands: AppBrand[]): BrandOption[] {
  return brands.map(mapBrandToOption);
}
