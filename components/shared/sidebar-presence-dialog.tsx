"use client";

import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/shared/app-dialog";
import { SidebarPresenceLoginRow } from "@/components/shared/sidebar-presence-login-row";
import { SidebarPresenceUserRow } from "@/components/shared/sidebar-presence-user-row";
import type { LoginHistoryEntry, PresenceUser } from "@/types/presence";

interface SidebarPresenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: PresenceUser[];
  loginHistory: LoginHistoryEntry[];
  onlineCount: number;
  isLoading: boolean;
}

export function SidebarPresenceDialog({
  open,
  onOpenChange,
  users,
  loginHistory,
  onlineCount,
  isLoading,
}: SidebarPresenceDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="sm" className="max-h-[min(92svh,36rem)]">
        <AppDialogHeader>
          <AppDialogTitle>Team presence</AppDialogTitle>
          <AppDialogDescription>
            {onlineCount} online · Based on recent app activity
          </AppDialogDescription>
        </AppDialogHeader>
        <AppDialogBody className="space-y-5 px-4 py-3">
          <section className="space-y-1">
            <p className="px-1 pb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Online now
            </p>
            {isLoading && users.length === 0 ? (
              <p className="px-1 py-4 text-center text-muted-foreground text-sm">
                Loading…
              </p>
            ) : users.length === 0 ? (
              <p className="px-1 py-4 text-center text-muted-foreground text-sm">
                No active users found.
              </p>
            ) : (
              users.map((user) => (
                <SidebarPresenceUserRow key={user.id} user={user} />
              ))
            )}
          </section>

          <section className="space-y-1 border-t border-(--separator) pt-4">
            <p className="px-1 pb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Login history
            </p>
            {isLoading && loginHistory.length === 0 ? (
              <p className="px-1 py-4 text-center text-muted-foreground text-sm">
                Loading…
              </p>
            ) : loginHistory.length === 0 ? (
              <p className="px-1 py-4 text-center text-muted-foreground text-sm">
                No recent logins yet.
              </p>
            ) : (
              loginHistory.map((entry) => (
                <SidebarPresenceLoginRow key={entry.id} entry={entry} />
              ))
            )}
          </section>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
