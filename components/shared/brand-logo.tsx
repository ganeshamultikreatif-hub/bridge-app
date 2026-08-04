"use client";

import { type BrandLogoSize, getBrandLogoFrame } from "@/config/brands";
import { useBrands } from "@/contexts/brands-context";
import { resolveBrandLogoUrl } from "@/lib/brands/logo";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  fallbackName?: string;
  logoUrl?: string | null;
  showPlaceholder?: boolean;
  size?: BrandLogoSize;
  slug: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }

  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export function BrandLogo({
  className,
  fallbackName,
  logoUrl,
  showPlaceholder = true,
  size = "sm",
  slug,
}: BrandLogoProps) {
  const { getBrandBySlug } = useBrands();
  const brand = getBrandBySlug(slug);
  const src = resolveBrandLogoUrl(slug, logoUrl ?? brand?.logoUrl);
  const name = fallbackName ?? brand?.name ?? slug;

  if (src) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center bg-transparent",
          getBrandLogoFrame(slug, size),
          className,
        )}
      >
        <img
          alt=""
          className="max-h-full max-w-full object-contain"
          src={src}
        />
      </span>
    );
  }

  if (!showPlaceholder) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-semibold uppercase text-muted-foreground",
        getBrandLogoFrame(slug, size),
        className,
      )}
      title={name}
    >
      {getInitials(name)}
    </span>
  );
}
