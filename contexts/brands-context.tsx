"use client";

import { createContext, useContext, useMemo } from "react";
import { mapBrandsToOptions } from "@/lib/brands/brand-option";
import type { AppBrand, BrandOption } from "@/types/brand";

interface BrandsContextValue {
  brands: AppBrand[];
  getBrandBySlug: (slug: string) => AppBrand | undefined;
  options: BrandOption[];
}

const BrandsContext = createContext<BrandsContextValue | null>(null);

interface BrandsProviderProps {
  brands: AppBrand[];
  children: React.ReactNode;
}

export function BrandsProvider({ brands, children }: BrandsProviderProps) {
  const value = useMemo<BrandsContextValue>(() => {
    const brandMap = new Map(brands.map((brand) => [brand.slug, brand]));

    return {
      brands,
      options: mapBrandsToOptions(brands),
      getBrandBySlug: (slug: string) => brandMap.get(slug),
    };
  }, [brands]);

  return (
    <BrandsContext.Provider value={value}>{children}</BrandsContext.Provider>
  );
}

export function useBrands(): BrandsContextValue {
  const context = useContext(BrandsContext);

  if (!context) {
    throw new Error("useBrands must be used within BrandsProvider");
  }

  return context;
}
