"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const AppearanceDrawer = dynamic(
  () =>
    import("@/components/shared/appearance-drawer").then((mod) => ({
      default: mod.AppearanceDrawer,
    })),
  { ssr: false },
);

interface AppearanceDrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openAppearance: () => void;
}

const AppearanceDrawerContext =
  createContext<AppearanceDrawerContextValue | null>(null);

interface AppearanceDrawerProviderProps {
  children: React.ReactNode;
}

export function AppearanceDrawerProvider({
  children,
}: AppearanceDrawerProviderProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const openAppearance = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);

  const handleSetOpen = useCallback((next: boolean) => {
    if (next) {
      setMounted(true);
    }
    setOpen(next);
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen: handleSetOpen,
      openAppearance,
    }),
    [open, handleSetOpen, openAppearance],
  );

  return (
    <AppearanceDrawerContext.Provider value={value}>
      {children}
      {mounted ? <AppearanceDrawer /> : null}
    </AppearanceDrawerContext.Provider>
  );
}

export function useAppearanceDrawer(): AppearanceDrawerContextValue {
  const context = useContext(AppearanceDrawerContext);

  if (!context) {
    throw new Error(
      "useAppearanceDrawer must be used within AppearanceDrawerProvider",
    );
  }

  return context;
}
