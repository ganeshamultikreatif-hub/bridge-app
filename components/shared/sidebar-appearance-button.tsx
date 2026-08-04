"use client";

import { useAppearanceDrawer } from "@/components/shared/appearance-drawer-provider";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SEPARATED_MENU_ITEM } from "@/config/sidebar";
import { PaintpaletteIcon } from "@/lib/icons";

export function SidebarAppearanceButton() {
  const { open, openAppearance } = useAppearanceDrawer();

  return (
    <SidebarMenuButton
      type="button"
      tooltip="Appearance"
      isActive={open}
      className={SEPARATED_MENU_ITEM}
      onClick={openAppearance}
    >
      <SidebarAppIcon icon={PaintpaletteIcon} tone="appearance" />
      <span>Appearance</span>
    </SidebarMenuButton>
  );
}
