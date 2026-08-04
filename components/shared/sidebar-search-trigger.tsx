"use client";

import { useEffect, useState } from "react";
import { GLASS_SURFACE } from "@/config/glass";
import { RADIUS_DEEP } from "@/config/shape";
import { MagnifyingGlassIcon } from "@/lib/icons";
import { getSidebarSearchShortcutLabel } from "@/lib/sidebar/search-shortcut";
import { cn } from "@/lib/utils";

interface SidebarSearchTriggerProps {
  onOpen: () => void;
  className?: string;
}

export function SidebarSearchTrigger({
  onOpen,
  className,
}: SidebarSearchTriggerProps) {
  const [shortcutLabel, setShortcutLabel] = useState("⌘/");

  useEffect(() => {
    setShortcutLabel(getSidebarSearchShortcutLabel());
  }, []);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        RADIUS_DEEP,
        GLASS_SURFACE,
        "flex h-8 w-full items-center gap-2 border-0! px-2.5 text-left text-sm text-muted-foreground shadow-none",
        "transition-colors hover:bg-black/8 dark:hover:bg-white/12",
        "focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
      aria-label="Search"
    >
      <MagnifyingGlassIcon className="size-3.5 shrink-0 opacity-70" />
      <span className="min-w-0 flex-1 truncate">Search</span>
      <kbd className="hidden rounded-md bg-black/5 px-1.5 py-0.5 font-medium text-[10px] text-muted-foreground sm:inline dark:bg-white/10">
        {shortcutLabel}
      </kbd>
    </button>
  );
}
