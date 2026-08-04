"use client";

import { Input } from "@/components/ui/input";
import { MOBILE_PAGE_SEARCH_INPUT } from "@/config/mobile-floating";
import { APP_GROUPED_SURFACE } from "@/config/shared-surfaces";
import { Search, X } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface MobileFilterSearchProps {
  "aria-label"?: string;
  className?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}

/** Large rounded search field used in mobile filter drawers. */
export function MobileFilterSearch({
  "aria-label": ariaLabel = "Cari",
  className,
  onChange,
  placeholder = "Cari…",
  value,
}: MobileFilterSearchProps) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-[1.15rem] -translate-y-1/2 text-muted-foreground"
      />
      <Input
        aria-label={ariaLabel}
        className={cn(
          APP_GROUPED_SURFACE,
          MOBILE_PAGE_SEARCH_INPUT,
          "h-12! pl-11 pr-11 text-[15px]",
        )}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
      {value ? (
        <button
          aria-label="Hapus pencarian"
          className="absolute top-1/2 right-2.5 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground active:bg-muted"
          onClick={() => onChange("")}
          type="button"
        >
          <X aria-hidden className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
