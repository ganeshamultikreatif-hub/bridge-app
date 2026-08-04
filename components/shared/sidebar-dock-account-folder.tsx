"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppearanceDrawer } from "@/components/shared/appearance-drawer-provider";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { useSidebarDockTooltipVisible } from "@/components/shared/sidebar-dock";
import { SidebarPresenceCountBadge } from "@/components/shared/sidebar-presence-count-badge";
import { SidebarProfileAvatar } from "@/components/shared/sidebar-profile-avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SIDEBAR_DOCK_ACTIVE_DOT_CLASS,
  SIDEBAR_DOCK_APP_ICON_SHELL,
  SIDEBAR_DOCK_LABEL_CLASS,
  SIDEBAR_DOCK_TRIGGER_CLASS,
} from "@/config/sidebar";
import { GearSixIcon, PaintpaletteIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types/user";

interface SidebarDockAccountFolderProps {
  currentUser: AppUser;
  settingsHref: string;
  settingsActive: boolean;
  isProfileOpen?: boolean;
  onlineCount?: number;
  onOpenProfile?: () => void;
  onOpenPresence?: () => void;
}

/** iOS-style dock folder — Appearance · Settings · Profile. */
export function SidebarDockAccountFolder({
  currentUser,
  settingsHref,
  settingsActive,
  isProfileOpen = false,
  onlineCount = 0,
  onOpenProfile,
  onOpenPresence,
}: SidebarDockAccountFolderProps) {
  const [open, setOpen] = useState(false);
  const tooltipVisible = useSidebarDockTooltipVisible();
  const { open: appearanceOpen, openAppearance } = useAppearanceDrawer();
  const folderActive =
    open || appearanceOpen || settingsActive || isProfileOpen;

  function handleAppearance() {
    setOpen(false);
    openAppearance();
  }

  function handleProfile() {
    setOpen(false);
    onOpenProfile?.();
  }

  return (
    <div className="relative flex items-center justify-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          aria-label="Account folder"
          aria-expanded={open}
          className={SIDEBAR_DOCK_TRIGGER_CLASS}
        >
          <span
            aria-hidden
            className={cn(
              SIDEBAR_DOCK_APP_ICON_SHELL,
              "grid grid-cols-2 place-items-center gap-0.5 overflow-hidden bg-linear-to-b from-[#3A3A3C] via-[#2C2C2E] to-[#1C1C1E] p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_1px_3px_rgba(0,0,0,0.5)]",
            )}
          >
            <span className="flex size-3.5 items-center justify-center rounded-[0.28rem] bg-linear-to-b from-[#BF5AF2] via-[#AF52DE] to-[#8944AB]">
              <PaintpaletteIcon className="size-2 text-white" />
            </span>
            <span className="flex size-3.5 items-center justify-center rounded-[0.28rem] bg-linear-to-b from-[#AEAEB2] via-[#8E8E93] to-[#636366]">
              <GearSixIcon className="size-2 text-white" />
            </span>
            <span className="col-span-2 flex size-3.5 items-center justify-center overflow-hidden rounded-full bg-linear-to-b from-[#C77DFF] via-[#AF52DE] to-[#7D3C98] text-[6px] font-semibold text-white">
              {currentUser.username.slice(0, 1).toUpperCase()}
            </span>
          </span>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          align="center"
          sideOffset={14}
          className="w-[11.5rem] gap-0 rounded-[1.35rem] p-3"
        >
          <p className="mb-2.5 px-0.5 text-center text-[11px] font-semibold tracking-wide text-muted-foreground">
            Account
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleAppearance}
              className="flex flex-col items-center gap-1.5 rounded-xl px-0.5 py-1 text-center transition-colors hover:bg-black/5 dark:hover:bg-white/8"
            >
              <SidebarAppIcon
                icon={PaintpaletteIcon}
                tone="appearance"
                size="dock"
              />
              <span className="max-w-full truncate text-[10px] font-medium leading-tight">
                Appearance
              </span>
            </button>

            <Link
              href={settingsHref}
              onClick={() => setOpen(false)}
              className="flex flex-col items-center gap-1.5 rounded-xl px-0.5 py-1 text-center transition-colors hover:bg-black/5 dark:hover:bg-white/8"
            >
              <SidebarAppIcon icon={GearSixIcon} tone="settings" size="dock" />
              <span className="max-w-full truncate text-[10px] font-medium leading-tight">
                Settings
              </span>
            </Link>

            <button
              type="button"
              onClick={handleProfile}
              className="relative flex flex-col items-center gap-1.5 rounded-xl px-0.5 py-1 text-center transition-colors hover:bg-black/5 dark:hover:bg-white/8"
            >
              <span className="relative">
                <SidebarProfileAvatar
                  name={currentUser.username}
                  avatarUrl={currentUser.avatarUrl}
                  size="dock"
                />
                {onOpenPresence ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setOpen(false);
                      onOpenPresence();
                    }}
                    className={cn(
                      "absolute top-0 right-0 z-10 flex size-5 translate-x-1/4 -translate-y-1/4",
                      "items-center justify-center rounded-full",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    )}
                    aria-label={`Team presence, ${onlineCount} online`}
                  >
                    <SidebarPresenceCountBadge count={onlineCount} />
                  </button>
                ) : null}
              </span>
              <span className="max-w-full truncate text-[10px] font-medium leading-tight">
                Profile
              </span>
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <span
        className={cn(
          SIDEBAR_DOCK_LABEL_CLASS,
          tooltipVisible && !open ? "opacity-100" : "opacity-0",
        )}
        aria-hidden={!tooltipVisible || open}
      >
        Account
      </span>
      {folderActive ? (
        <span aria-hidden className={SIDEBAR_DOCK_ACTIVE_DOT_CLASS} />
      ) : null}
    </div>
  );
}
