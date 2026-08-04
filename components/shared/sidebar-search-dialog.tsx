"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useAppearanceDrawer } from "@/components/shared/appearance-drawer-provider";
import { SidebarSearchResultItem } from "@/components/shared/sidebar-search-result-item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DIALOG_SIZE } from "@/config/dialog";
import { useCurrentUser } from "@/contexts/current-user-context";
import { MagnifyingGlassIcon } from "@/lib/icons";
import {
  buildSidebarSearchItems,
  filterSidebarSearchItems,
  type SidebarSearchItem,
} from "@/lib/sidebar/search";
import { getSidebarSearchShortcutLabel } from "@/lib/sidebar/search-shortcut";
import { cn } from "@/lib/utils";

interface SidebarSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SidebarSearchDialog({
  open,
  onOpenChange,
}: SidebarSearchDialogProps) {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { openAppearance } = useAppearanceDrawer();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [shortcutLabel, setShortcutLabel] = useState("⌘/");

  const searchItems = useMemo(
    () => buildSidebarSearchItems(currentUser),
    [currentUser],
  );

  const results = useMemo(
    () => filterSidebarSearchItems(query, searchItems),
    [query, searchItems],
  );

  useEffect(() => {
    setShortcutLabel(getSidebarSearchShortcutLabel());
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
      return;
    }

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset highlight whenever query text changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function handleSelect(item: SidebarSearchItem) {
    onOpenChange(false);

    if (item.action === "appearance") {
      openAppearance();
      return;
    }

    if (item.href) {
      router.push(item.href);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length === 0 ? 0 : (index + 1) % results.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length === 0
          ? 0
          : (index - 1 + results.length) % results.length,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const item = results[activeIndex];
      if (item) {
        handleSelect(item);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
        className={cn(
          DIALOG_SIZE.md,
          "top-[min(20vh,8rem)] flex translate-y-0! flex-col",
        )}
      >
        <DialogHeader className="sr-only border-0 p-0">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Loncat ke halaman atau buka Appearance.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 border-b border-border/60 px-3">
          <MagnifyingGlassIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <Input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search"
            aria-controls={listId}
            aria-autocomplete="list"
            className={cn(
              "h-11 border-0 bg-transparent px-0 shadow-none",
              "focus-visible:border-0 focus-visible:ring-0",
              "dark:bg-transparent",
            )}
          />
          <kbd className="hidden rounded-md bg-black/5 px-1.5 py-0.5 font-medium text-[10px] text-muted-foreground sm:inline dark:bg-white/10">
            {shortcutLabel}
          </kbd>
        </div>

        <div
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="max-h-[min(50vh,22rem)] overflow-y-auto p-2"
        >
          {results.length > 0 ? (
            <ul className="space-y-0.5">
              {results.map((item, index) => (
                <li key={item.id}>
                  <div
                    role="option"
                    aria-selected={index === activeIndex}
                    tabIndex={-1}
                  >
                    <SidebarSearchResultItem
                      item={item}
                      active={index === activeIndex}
                      onSelect={handleSelect}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
              Tidak ada hasil untuk “{query.trim()}”
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/60 px-3 py-2 text-xs text-muted-foreground">
          <span>Gunakan panah untuk navigasi</span>
          <span>Enter untuk membuka</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
