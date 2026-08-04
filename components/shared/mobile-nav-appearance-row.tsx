"use client";

import { AppearanceView } from "@/components/shared/appearance-view";
import {
  NestedDrawer,
  PICKER_NESTED_DRAWER_SURFACE,
} from "@/components/shared/nested-drawer";
import { NestedDrawerHeader } from "@/components/shared/nested-drawer-header";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { SHELL_PADDING } from "@/config/spacing";
import { ChevronRight, PaintpaletteIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const ROW_CLASS =
  "flex w-full items-center gap-3 rounded-(--radius-inner) bg-(--grouped-surface) px-3 py-2.5 text-sm font-medium text-foreground transition-colors active:bg-muted";

/** Appearance entry in the bottom-nav menu — opens nested drawer (wang). */
export function MobileNavAppearanceRow() {
  return (
    <NestedDrawer
      className={PICKER_NESTED_DRAWER_SURFACE}
      title="Appearance"
      trigger={
        <button className={ROW_CLASS} type="button">
          <SidebarAppIcon
            icon={PaintpaletteIcon}
            size="dock"
            tone="appearance"
          />
          <span className="flex-1 text-left">Appearance</span>
          <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
        </button>
      }
    >
      <NestedDrawerHeader backLabel="Menu" title="Appearance" />
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-contain",
          SHELL_PADDING,
        )}
      >
        <AppearanceView />
      </div>
    </NestedDrawer>
  );
}
