"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  HEADER_TOOLBAR_CLASS,
  HEADER_TOOLBAR_CONTAINER,
} from "@/config/header-toolbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface HeaderActionsContextValue {
  badgeCount: number;
  desktopActions: ReactNode;
  /** `false` = no mobile tools (do not fall back to desktop). */
  mobileActions: ReactNode | false;
  setBadgeCount: (count: number) => void;
  setDesktopActions: (actions: ReactNode) => void;
  setMobileActions: (actions: ReactNode | false) => void;
}

const HeaderActionsContext = createContext<HeaderActionsContextValue | null>(
  null,
);

export function HeaderActionsProvider({ children }: { children: ReactNode }) {
  const [desktopActions, setDesktopActionsState] = useState<ReactNode>(null);
  const [mobileActions, setMobileActionsState] = useState<ReactNode | false>(
    null,
  );
  const [badgeCount, setBadgeCountState] = useState(0);

  const setDesktopActions = useCallback((next: ReactNode) => {
    setDesktopActionsState(next);
  }, []);

  const setMobileActions = useCallback((next: ReactNode | false) => {
    setMobileActionsState(next);
  }, []);

  const setBadgeCount = useCallback((count: number) => {
    setBadgeCountState(count);
  }, []);

  const value = useMemo(
    () => ({
      badgeCount,
      desktopActions,
      mobileActions,
      setBadgeCount,
      setDesktopActions,
      setMobileActions,
    }),
    [
      badgeCount,
      desktopActions,
      mobileActions,
      setBadgeCount,
      setDesktopActions,
      setMobileActions,
    ],
  );

  return (
    <HeaderActionsContext.Provider value={value}>
      {children}
    </HeaderActionsContext.Provider>
  );
}

function useHeaderActionsContext() {
  const context = useContext(HeaderActionsContext);
  if (!context) {
    throw new Error("Header actions require HeaderActionsProvider");
  }
  return context;
}

/**
 * Mobile tools drawer content — prefers a mobile-native tree, falls back to
 * the desktop toolbar (legacy pages that only register desktop).
 * `false` disables the tools orb (in-page filters + FAB pages).
 */
export function useHeaderActionsNode(): ReactNode {
  const { desktopActions, mobileActions } = useHeaderActionsContext();
  if (mobileActions === false) {
    return null;
  }
  return mobileActions ?? desktopActions;
}

/** True when the page registered a mobile-native tools tree. */
export function useHasMobileHeaderActions(): boolean {
  const { mobileActions } = useHeaderActionsContext();
  return Boolean(mobileActions) && mobileActions !== false;
}

/** Active-filter badge for the mobile tools orb. */
export function useHeaderActionsBadgeCount(): number {
  return useHeaderActionsContext().badgeCount;
}

type HeaderActionsViewport = "mobile" | "desktop";

/** Renders page-registered filters / toolbar in AppHeader (desktop by default). */
export function HeaderActionsSlot({
  className,
  viewport = "desktop",
}: {
  className?: string;
  viewport?: HeaderActionsViewport | "all";
}) {
  const isMobile = useIsMobile();
  const { desktopActions, mobileActions } = useHeaderActionsContext();
  const actions =
    viewport === "mobile"
      ? mobileActions === false
        ? null
        : (mobileActions ?? desktopActions)
      : desktopActions;

  if (!actions) {
    return null;
  }

  if (viewport === "mobile" && !isMobile) {
    return null;
  }

  if (viewport === "desktop" && isMobile) {
    return null;
  }

  return (
    <div className={cn(HEADER_TOOLBAR_CONTAINER, className)}>
      <div className={HEADER_TOOLBAR_CLASS} data-slot="header-toolbar">
        {actions}
      </div>
    </div>
  );
}

/**
 * Registers header actions from a page view.
 * Use `viewport="mobile"` for a mobile-native tools drawer body.
 * Use `disableMobileFallback` with desktop tools so the funnel orb stays hidden
 * when search/filters live in-page (wang journal pattern).
 */
export function HeaderActions({
  children,
  disableMobileFallback = false,
  viewport = "desktop",
}: {
  children: ReactNode;
  disableMobileFallback?: boolean;
  viewport?: HeaderActionsViewport;
}) {
  const { setDesktopActions, setMobileActions } = useHeaderActionsContext();

  useLayoutEffect(() => {
    if (viewport === "mobile") {
      setMobileActions(children);
      return () => setMobileActions(null);
    }

    setDesktopActions(children);
    if (disableMobileFallback) {
      setMobileActions(false);
    }

    return () => {
      setDesktopActions(null);
      if (disableMobileFallback) {
        setMobileActions(null);
      }
    };
  }, [
    children,
    disableMobileFallback,
    setDesktopActions,
    setMobileActions,
    viewport,
  ]);

  return null;
}

/** Badge count on the mobile filter orb (e.g. active scheduler filters). */
export function HeaderActionsBadge({ count }: { count: number }) {
  const { setBadgeCount } = useHeaderActionsContext();

  useLayoutEffect(() => {
    setBadgeCount(count);
    return () => setBadgeCount(0);
  }, [count, setBadgeCount]);

  return null;
}
