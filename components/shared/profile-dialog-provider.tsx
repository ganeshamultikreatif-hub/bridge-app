"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useCurrentUser } from "@/contexts/current-user-context";
import type { AppUser } from "@/types/user";

const SidebarProfileDialog = dynamic(
  () =>
    import("@/components/shared/sidebar-profile-dialog").then((mod) => ({
      default: mod.SidebarProfileDialog,
    })),
  { ssr: false },
);

interface ProfileDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openProfile: () => void;
}

const ProfileDialogContext = createContext<ProfileDialogContextValue | null>(
  null,
);

interface ProfileDialogProviderProps {
  children: React.ReactNode;
}

export function ProfileDialogProvider({
  children,
}: ProfileDialogProviderProps) {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [open, setOpenState] = useState(false);
  const [mounted, setMounted] = useState(false);

  const openProfile = useCallback(() => {
    setMounted(true);
    setOpenState(true);
  }, []);

  const setOpen = useCallback((next: boolean) => {
    if (next) {
      setMounted(true);
    }
    setOpenState(next);
  }, []);

  const handleUserUpdate = useCallback(
    (user: AppUser) => {
      setCurrentUser(user);
    },
    [setCurrentUser],
  );

  const value = useMemo(
    () => ({
      open,
      setOpen,
      openProfile,
    }),
    [open, setOpen, openProfile],
  );

  return (
    <ProfileDialogContext.Provider value={value}>
      {children}
      {mounted ? (
        <SidebarProfileDialog
          user={currentUser}
          open={open}
          onOpenChange={setOpen}
          onUserUpdate={handleUserUpdate}
        />
      ) : null}
    </ProfileDialogContext.Provider>
  );
}

export function useProfileDialog(): ProfileDialogContextValue {
  const context = useContext(ProfileDialogContext);

  if (!context) {
    throw new Error(
      "useProfileDialog must be used within ProfileDialogProvider",
    );
  }

  return context;
}
