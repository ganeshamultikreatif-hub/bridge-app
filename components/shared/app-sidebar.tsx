"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useProfileDialog } from "@/components/shared/profile-dialog-provider";
import { SidebarCollapseTrigger } from "@/components/shared/sidebar-collapse-trigger";
import { SidebarCollapsedDock } from "@/components/shared/sidebar-collapsed-dock";
import { SidebarNav } from "@/components/shared/sidebar-nav";
import {
  SidebarBrandButton,
  SidebarProfileButton,
} from "@/components/shared/sidebar-profile-button";
import { SidebarSearchTrigger } from "@/components/shared/sidebar-search-trigger";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  SEPARATED_SIDEBAR_CLASS,
  SEPARATED_SIDEBAR_GUTTER,
  SIDEBAR_COLLAPSED_DOCK_WRAPPER,
} from "@/config/sidebar";
import { useCurrentUser } from "@/contexts/current-user-context";
import { usePresence } from "@/hooks/use-presence";
import { isSidebarSearchShortcut } from "@/lib/sidebar/search-shortcut";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types/user";

const SidebarPresenceDialog = dynamic(
  () =>
    import("@/components/shared/sidebar-presence-dialog").then((mod) => ({
      default: mod.SidebarPresenceDialog,
    })),
  { ssr: false },
);

const SidebarSearchDialog = dynamic(
  () =>
    import("@/components/shared/sidebar-search-dialog").then((mod) => ({
      default: mod.SidebarSearchDialog,
    })),
  { ssr: false },
);

interface AppSidebarProps {
  currentUser: AppUser;
  notificationsNewCount?: number;
  schedulerNewCount?: number;
}

export function AppSidebar({
  currentUser: currentUserProp,
  notificationsNewCount = 0,
  schedulerNewCount = 0,
}: AppSidebarProps) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const { currentUser } = useCurrentUser();
  const { openProfile, open: profileOpen } = useProfileDialog();
  const [searchOpen, setSearchOpen] = useState(false);
  const [presenceOpen, setPresenceOpen] = useState(false);
  const {
    onlineCount,
    users: presenceUsers,
    loginHistory: presenceLoginHistory,
    isLoading: presenceLoading,
    refresh: refreshPresence,
  } = usePresence({ active: presenceOpen });

  const displayUser =
    currentUser.id === currentUserProp.id ? currentUser : currentUserProp;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isSidebarSearchShortcut(event)) {
        return;
      }

      event.preventDefault();
      setSearchOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleOpenPresence() {
    setPresenceOpen(true);
    void refreshPresence();
  }

  return (
    <>
      <Sidebar
        variant="floating"
        collapsible="icon"
        className={cn(
          SEPARATED_SIDEBAR_CLASS,
          "group/sidebar",
          SEPARATED_SIDEBAR_GUTTER,
        )}
      >
        {isCollapsed ? (
          <div className={SIDEBAR_COLLAPSED_DOCK_WRAPPER}>
            <SidebarCollapsedDock
              currentUser={displayUser}
              notificationsNewCount={notificationsNewCount}
              schedulerNewCount={schedulerNewCount}
              onlineCount={onlineCount}
              onOpenProfile={openProfile}
              onOpenPresence={handleOpenPresence}
              isProfileOpen={profileOpen}
              onOpenSearch={() => setSearchOpen(true)}
              isSearchOpen={searchOpen}
            />
          </div>
        ) : (
          <>
            <SidebarHeader className="gap-2 p-0">
              <SidebarMenu className="w-full">
                <SidebarMenuItem>
                  <SidebarBrandButton />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>

            <div className="px-0 py-2">
              <SidebarSearchTrigger onOpen={() => setSearchOpen(true)} />
            </div>

            <SidebarContent className="gap-0 p-0">
              <SidebarNav
                currentUser={displayUser}
                notificationsNewCount={notificationsNewCount}
                schedulerNewCount={schedulerNewCount}
              />
            </SidebarContent>

            <SidebarFooter className="gap-0 overflow-visible p-0">
              <SidebarSeparator className="mx-0 mb-2 bg-(--separator)" />
              <SidebarProfileButton
                user={displayUser}
                onlineCount={onlineCount}
                onOpen={openProfile}
                onOpenPresence={handleOpenPresence}
              />
            </SidebarFooter>
          </>
        )}
      </Sidebar>

      <SidebarCollapseTrigger className="md:z-999" />
      {searchOpen ? (
        <SidebarSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      ) : null}
      {presenceOpen ? (
        <SidebarPresenceDialog
          open={presenceOpen}
          onOpenChange={setPresenceOpen}
          users={presenceUsers}
          loginHistory={presenceLoginHistory}
          onlineCount={onlineCount}
          isLoading={presenceLoading}
        />
      ) : null}
    </>
  );
}
