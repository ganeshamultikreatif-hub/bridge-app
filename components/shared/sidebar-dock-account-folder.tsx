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
import { DEFAULT_APP_ICON_STYLE } from "@/config/appearance";
import { GLASS_SHELL_SURFACE } from "@/config/glass";
import {
  getSidebarAppIconTone,
  SIDEBAR_DOCK_ACTIVE_DOT_CLASS,
  SIDEBAR_DOCK_LABEL_CLASS,
  SIDEBAR_DOCK_TRIGGER_CLASS,
} from "@/config/sidebar";
import { useOptionalAppearance } from "@/contexts/appearance-context";
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
const FOLDER_GRID = "grid size-[22px] grid-cols-2 grid-rows-2 gap-[2px]";

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
  const appearance = useOptionalAppearance();
  const iconStyle = appearance?.appIconStyle ?? DEFAULT_APP_ICON_STYLE;
  const appearanceTone = getSidebarAppIconTone("appearance", iconStyle);
  const settingsTone = getSidebarAppIconTone("settings", iconStyle);
  const profileTone = getSidebarAppIconTone("profile", iconStyle);
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
              <span className={cn(MINI_TILE, appearanceTone.shell)}>
                <PaintpaletteIcon
                  className={cn(
                    "size-[5px] drop-shadow-sm",
                    appearanceTone.glyph,
                  )}
                />
              </span>
              <span className={cn(MINI_TILE, settingsTone.shell)}>
                <GearSixIcon
                  className={cn("size-[5px] drop-shadow-sm", settingsTone.glyph)}
                />
              </span>
              <span
                className={cn(
                  MINI_TILE,
                  profileTone.shell,
                  profileTone.glyph,
                  "overflow-hidden text-[4.5px] font-bold leading-none",
                )}
              >
                {initial}
              </span>
              {/* Fourth cell — iOS-style mini stack placeholder */}
              <span
                className={cn(
                  "grid size-full grid-cols-2 grid-rows-2 gap-px rounded-[2.5px] p-px",
                  iconStyle === "light"
                    ? "bg-black/6"
                    : iconStyle === "dark"
                      ? "bg-white/10"
                      : "bg-black/5 dark:bg-white/8",
                )}
              >
                <span
                  className={cn(
                    "rounded-[1px]",
                    iconStyle === "colored"
                      ? "bg-[#AF52DE]/80"
                      : iconStyle === "light"
                        ? "bg-[#AF52DE]/55"
                        : "bg-[#BF5AF2]/70",
                  )}
                />
                <span
                  className={cn(
                    "rounded-[1px]",
                    iconStyle === "colored"
                      ? "bg-[#8E8E93]/80"
                      : iconStyle === "light"
                        ? "bg-[#8E8E93]/45"
                        : "bg-[#AEAEB2]/70",
                  )}
                />
                <span
                  className={cn(
                    "rounded-[1px]",
                    iconStyle === "colored"
                      ? "bg-[#7D3C98]/80"
                      : iconStyle === "light"
                        ? "bg-[#7D3C98]/50"
                        : "bg-[#C77DFF]/65",
                  )}
                />
                <span
                  className={cn(
                    "rounded-[1px]",
                    iconStyle === "colored"
                      ? "bg-[#AEAEB2]/70"
                      : iconStyle === "light"
                        ? "bg-[#AEAEB2]/40"
                        : "bg-[#C7C7CC]/60",
                  )}
                />
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
