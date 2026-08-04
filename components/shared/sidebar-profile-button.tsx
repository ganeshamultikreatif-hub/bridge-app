"use client";

import { AppLogo } from "@/components/shared/app-logo";
import { SidebarPresenceTrigger } from "@/components/shared/sidebar-presence-trigger";
import { SidebarProfileAvatar } from "@/components/shared/sidebar-profile-avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { APP_NAME } from "@/config/app";
import { RADIUS_DEEP } from "@/config/shape";
import {
  getSidebarAppMarkLogoClasses,
  getSidebarAppMarkShellClasses,
  SEPARATED_MENU_ITEM,
  SIDEBAR_APP_MARK_LOGO_SIZE,
} from "@/config/sidebar";
import { useOptionalAppearance } from "@/contexts/appearance-context";
import { CaretRightIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types/user";

interface SidebarBrandButtonProps {
  className?: string;
}

/**
 * App mark + name in the expanded sidebar header.
 * Caret / hover affordance for multi-workspace switching is intentionally
 * off until that feature ships.
 */
export function SidebarBrandButton({ className }: SidebarBrandButtonProps) {
  const appearance = useOptionalAppearance();
  const iconStyle = appearance?.appIconStyle ?? "colored";

  return (
    <SidebarMenuButton
      type="button"
      size="lg"
      tooltip={APP_NAME}
      className={cn(
        SEPARATED_MENU_ITEM,
        "h-auto! py-1.5!",
        "pointer-events-none cursor-default hover:bg-transparent! active:bg-transparent!",
        "dark:hover:bg-transparent! dark:active:bg-transparent!",
        "group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-[0.7rem]! group-data-[collapsible=icon]:bg-transparent! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:hover:bg-transparent!",
        className,
      )}
    >
      <span
        className={cn(
          getSidebarAppMarkShellClasses("dock", iconStyle, "brand"),
          "overflow-hidden",
          getSidebarAppMarkLogoClasses(iconStyle),
        )}
      >
        <AppLogo className={SIDEBAR_APP_MARK_LOGO_SIZE} />
      </span>

      <span className="inline-flex min-w-0 flex-1 items-center gap-2 group-data-[collapsible=icon]:hidden">
        <span className="truncate font-semibold text-sm leading-none">
          {APP_NAME}
        </span>
      </span>
    </SidebarMenuButton>
  );
}

interface SidebarProfileButtonProps {
  user: AppUser;
  onlineCount: number;
  onOpen: () => void;
  onOpenPresence: () => void;
  className?: string;
}

export function SidebarProfileButton({
  user,
  onlineCount,
  onOpen,
  onOpenPresence,
  className,
}: SidebarProfileButtonProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-1 overflow-visible p-1",
        className,
      )}
    >
      <SidebarPresenceTrigger
        count={onlineCount}
        onOpen={onOpenPresence}
        className={cn(
          RADIUS_DEEP,
          "p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/8",
        )}
      >
        <SidebarProfileAvatar
          name={user.username}
          avatarUrl={user.avatarUrl}
          size="sm"
        />
      </SidebarPresenceTrigger>

      <button
        type="button"
        onClick={onOpen}
        className={cn(
          RADIUS_DEEP,
          "flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left transition-colors",
          "hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          "dark:hover:bg-white/8",
        )}
        aria-label={`Open profile for ${user.username}`}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium leading-tight">
            {user.username}
          </span>
          <span className="mt-0.5 block truncate text-xs leading-tight text-muted-foreground">
            {user.email}
          </span>
        </span>
        <CaretRightIcon className="size-3 shrink-0 text-muted-foreground opacity-60" />
      </button>
    </div>
  );
}
