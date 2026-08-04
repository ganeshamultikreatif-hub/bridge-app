"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppearanceDrawer } from "@/components/shared/appearance-drawer-provider";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { useSidebarDockTooltipVisible } from "@/components/shared/sidebar-dock";
import { SidebarPresenceCountBadge } from "@/components/shared/sidebar-presence-count-badge";
import { SidebarProfileAvatar } from "@/components/shared/sidebar-profile-avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { GLASS_SHELL_SURFACE } from "@/config/glass";
import {
  SIDEBAR_DOCK_ACTIVE_DOT_CLASS,
  SIDEBAR_DOCK_LABEL_CLASS,
  SIDEBAR_DOCK_TRIGGER_CLASS,
} from "@/config/sidebar";
import { GearSixIcon, PaintpaletteIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types/user";

/** iOS App Library folder face — frosted glass + inset 2×2 preview. */
const FOLDER_FACE = [
  "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[0.7rem]",
  "bg-[#d8d8dc]/55 dark:bg-[#3a3a3c]/55",
  "backdrop-blur-md backdrop-saturate-150",
  "shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.55),0_1px_2px_rgba(0,0,0,0.14)]",
  "dark:shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.16),0_1px_3px_rgba(0,0,0,0.45)]",
  "ring-1 ring-black/6 dark:ring-white/10",
].join(" ");

/** Preview grid sits inset so tiles don't fill the dock shell. */
const FOLDER_GRID =
  "grid size-[22px] grid-cols-2 grid-rows-2 gap-[2px]";

const MINI_TILE =
  "flex size-full items-center justify-center rounded-[2.5px] bg-linear-to-b shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.35),0_0.5px_1px_rgba(0,0,0,0.18)]";

interface SidebarDockAccountFolderProps {
  currentUser: AppUser;
  settingsHref: string;
  settingsActive: boolean;
  isProfileOpen?: boolean;
  onlineCount?: number;
  onOpenProfile?: () => void;
  onOpenPresence?: () => void;
}

/** iOS App Library–style dock folder — Appearance · Settings · Profile. */
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
  const initial = currentUser.username.slice(0, 1).toUpperCase();

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
      <HoverCard
        open={open}
        onOpenChange={setOpen}
        openDelay={80}
        closeDelay={120}
      >
        <HoverCardTrigger
          aria-label="Account folder"
          aria-expanded={open}
          className={SIDEBAR_DOCK_TRIGGER_CLASS}
        >
          <span aria-hidden className={FOLDER_FACE}>
            <span className={FOLDER_GRID}>
              <span
                className={cn(
                  MINI_TILE,
                  "from-[#BF5AF2] via-[#AF52DE] to-[#8944AB]",
                )}
              >
                <PaintpaletteIcon className="size-1.25 text-white drop-shadow-sm" />
              </span>
              <span
                className={cn(
                  MINI_TILE,
                  "from-[#AEAEB2] via-[#8E8E93] to-[#636366]",
                )}
              >
                <GearSixIcon className="size-1.25 text-white drop-shadow-sm" />
              </span>
              <span
                className={cn(
                  MINI_TILE,
                  "overflow-hidden from-[#C77DFF] via-[#AF52DE] to-[#7D3C98] text-[4.5px] font-bold leading-none text-white",
                )}
              >
                {initial}
              </span>
              {/* Fourth cell — iOS-style mini stack placeholder */}
              <span className="grid size-full grid-cols-2 grid-rows-2 gap-px rounded-[2.5px] bg-black/5 p-px dark:bg-white/8">
                <span className="rounded-[1px] bg-[#AF52DE]/80" />
                <span className="rounded-[1px] bg-[#8E8E93]/80" />
                <span className="rounded-[1px] bg-[#7D3C98]/80" />
                <span className="rounded-[1px] bg-[#AEAEB2]/70" />
              </span>
            </span>
          </span>
        </HoverCardTrigger>

        <HoverCardContent
          side="right"
          align="center"
          sideOffset={14}
          className="w-auto border-0 bg-transparent p-0 shadow-none ring-0 backdrop-blur-none"
        >
          <div
            className={cn(
              GLASS_SHELL_SURFACE,
              "w-54 rounded-[1.75rem] p-3.5",
              "shadow-[0_12px_40px_rgba(0,0,0,0.16)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.42)]",
            )}
          >
            <p className="mb-3 text-center text-[11px] font-semibold tracking-wide text-foreground/70">
              Account
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={handleAppearance}
                className="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl px-0.5 py-1 text-center transition-transform active:scale-95"
              >
                <SidebarAppIcon
                  icon={PaintpaletteIcon}
                  tone="appearance"
                  size="dock"
                />
                <span className="max-w-full truncate text-[10px] font-medium leading-tight text-foreground">
                  Appearance
                </span>
              </button>

              <Link
                href={settingsHref}
                onClick={() => setOpen(false)}
                className="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl px-0.5 py-1 text-center transition-transform active:scale-95"
              >
                <SidebarAppIcon
                  icon={GearSixIcon}
                  tone="settings"
                  size="dock"
                />
                <span className="max-w-full truncate text-[10px] font-medium leading-tight text-foreground">
                  Settings
                </span>
              </Link>

              <button
                type="button"
                onClick={handleProfile}
                className="relative flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl px-0.5 py-1 text-center transition-transform active:scale-95"
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
                        "cursor-pointer items-center justify-center rounded-full",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      )}
                      aria-label={`Team presence, ${onlineCount} online`}
                    >
                      <SidebarPresenceCountBadge count={onlineCount} />
                    </button>
                  ) : null}
                </span>
                <span className="max-w-full truncate text-[10px] font-medium leading-tight text-foreground">
                  Profile
                </span>
              </button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

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
