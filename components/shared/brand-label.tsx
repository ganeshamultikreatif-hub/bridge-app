"use client";

import { useBrands } from "@/contexts/brands-context";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";

interface BrandLabelProps {
  className?: string;
  showName?: boolean;
  size?: "xs" | "sm" | "md";
  slug: string;
}

export function BrandLabel({
  className,
  showName = true,
  size = "sm",
  slug,
}: BrandLabelProps) {
  const { getBrandBySlug } = useBrands();
  const name = getBrandBySlug(slug)?.name ?? slug;

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <BrandLogo size={size} slug={slug} />
      {showName ? <span className="truncate text-inherit">{name}</span> : null}
    </span>
  );
}
