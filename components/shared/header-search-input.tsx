"use client";

import { Input } from "@/components/ui/input";
import {
  HEADER_TOOLBAR_GLYPH,
  HEADER_TOOLBAR_GLYPH_MUTED,
  HEADER_TOOLBAR_HEIGHT,
  HEADER_TOOLBAR_SEARCH_INPUT,
} from "@/config/header-toolbar";
import { Search, X } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface HeaderSearchInputProps {
  ariaLabel: string;
  className?: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}

export function HeaderSearchInput({
  ariaLabel,
  className,
  onChange,
  placeholder,
  value,
}: HeaderSearchInputProps) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <Search
        aria-hidden="true"
        className={cn(
          HEADER_TOOLBAR_GLYPH_MUTED,
          "pointer-events-none absolute top-1/2 left-2.5 z-10 -translate-y-1/2",
        )}
      />
      <Input
        aria-label={ariaLabel}
        className={cn(
          HEADER_TOOLBAR_SEARCH_INPUT,
          HEADER_TOOLBAR_HEIGHT,
          "rounded-full! placeholder:text-muted-foreground",
        )}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {value ? (
        <button
          aria-label="Hapus pencarian"
          className="absolute top-1/2 right-1.5 z-10 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          onClick={() => onChange("")}
          type="button"
        >
          <X aria-hidden="true" className={HEADER_TOOLBAR_GLYPH} />
        </button>
      ) : null}
    </div>
  );
}
