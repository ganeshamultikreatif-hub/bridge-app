"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { logoutAction } from "@/actions/auth.actions";
import { PushSubscriptionButton } from "@/components/notifications/push-subscription-button";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { useCloseMobileSidebar } from "@/hooks/use-close-mobile-sidebar";
import { LogOut, MoreVertical, UserCircle } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types/user";

interface SidebarUserProfileProps {
  user: AppUser;
}

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

function ProfileAvatar({ username }: { username: string }) {
  return (
    <div className="relative shrink-0">
      <span className="flex size-9 items-center justify-center rounded-[0.7rem] bg-linear-to-b from-[#AEAEB2] via-[#8E8E93] to-[#636366] text-xs font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),0_1px_2px_rgba(0,0,0,0.14)]">
        {getInitials(username)}
      </span>
      <span
        aria-hidden="true"
        className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-background bg-green-500"
      />
    </div>
  );
}

export function SidebarUserProfile({ user }: SidebarUserProfileProps) {
  const { state } = useSidebar();
  const closeMobileSidebar = useCloseMobileSidebar();
  const isCollapsed = state === "collapsed";
  const [open, setOpen] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();

  function handleLogout() {
    setOpen(false);
    startLogout(async () => {
      toast.success("Berhasil logout");
      await logoutAction();
    });
  }

  return (
    <div
      className={cn(
        "app-grouped-surface relative flex items-center gap-2 rounded-xl p-2",
        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:backdrop-blur-none group-data-[collapsible=icon]:p-0",
      )}
    >
      <Popover onOpenChange={setOpen} open={open}>
        {isCollapsed ? (
          <PopoverTrigger asChild>
            <Button
              aria-label="Menu profil"
              className="size-9 rounded-full p-0 hover:bg-sidebar-accent"
              size="icon"
              type="button"
              variant="ghost"
            >
              <ProfileAvatar username={user.username} />
            </Button>
          </PopoverTrigger>
        ) : (
          <>
            <ProfileAvatar username={user.username} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                {user.username}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {user.email}
              </p>
            </div>

            <PopoverTrigger asChild>
              <Button
                aria-label="Menu profil"
                className="size-7 shrink-0 rounded-lg text-sidebar-foreground/70"
                size="icon"
                type="button"
                variant="ghost"
              >
                <MoreVertical className="size-4" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
          </>
        )}

        <PopoverContent
          align={isCollapsed ? "start" : "end"}
          className="app-grouped-surface w-56 gap-1 border-[var(--glass-shell-border)] p-1.5 shadow-xl"
          side="top"
        >
          <Button
            asChild
            className="h-9 w-full justify-start gap-2 rounded-md px-2 font-normal"
            variant="ghost"
          >
            <Link
              href="/profile"
              onClick={() => {
                setOpen(false);
                closeMobileSidebar();
              }}
            >
              <UserCircle className="size-4" aria-hidden="true" />
              View profile
            </Link>
          </Button>
          <PushSubscriptionButton appearance="menuItem" />
          <Button
            className="h-9 w-full justify-start gap-2 rounded-md px-2 font-normal text-destructive hover:text-destructive"
            disabled={isLoggingOut}
            onClick={handleLogout}
            type="button"
            variant="ghost"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
