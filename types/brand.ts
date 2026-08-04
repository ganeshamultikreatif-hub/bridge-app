export interface AppBrand {
  id: string;
  logoUrl: string | null;
  name: string;
  slug: string;
}

export interface BrandOption {
  label: string;
  logoSrc: string | null;
  value: string;
}
