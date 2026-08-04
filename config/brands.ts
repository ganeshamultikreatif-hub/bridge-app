export type BrandLogoSize = "xs" | "sm" | "md";

export const BRAND_LOGO_FRAME = {
  xs: "h-4 w-5",
  sm: "h-5 w-6",
  md: "h-6 w-8",
} as const satisfies Record<BrandLogoSize, string>;

export const DEFAULT_BRAND_ASSETS = [
  {
    slug: "ganesha_consulting",
    name: "Ganesha Consulting",
    logoSrc: "/brands/ganesha-consulting.png",
    logoFrame: {
      xs: "h-4 w-4",
      sm: "h-5 w-5",
      md: "h-6 w-6",
    },
  },
  {
    slug: "go_space",
    name: "Go Space",
    logoSrc: "/brands/go-space.png",
    logoFrame: {
      xs: "h-4 w-5",
      sm: "h-5 w-6",
      md: "h-7 w-8",
    },
  },
  {
    slug: "gonline",
    name: "Gonline",
    logoSrc: "/brands/gonline.png",
    logoFrame: {
      xs: "h-3 w-7",
      sm: "h-3.5 w-9",
      md: "h-4 w-11",
    },
  },
] as const;

type DefaultBrandAsset = (typeof DEFAULT_BRAND_ASSETS)[number];

export function getDefaultBrandAsset(
  slug: string,
): DefaultBrandAsset | undefined {
  return DEFAULT_BRAND_ASSETS.find((brand) => brand.slug === slug);
}

export function getBrandLogoSrc(slug: string): string | undefined {
  return getDefaultBrandAsset(slug)?.logoSrc;
}

export function getBrandLogoFrame(
  slug: string,
  size: BrandLogoSize = "sm",
): string {
  return getDefaultBrandAsset(slug)?.logoFrame[size] ?? BRAND_LOGO_FRAME[size];
}
