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
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface HeaderTrailingContextValue {
  trailing: ReactNode;
  setTrailing: (trailing: ReactNode) => void;
}

const HeaderTrailingContext = createContext<HeaderTrailingContextValue | null>(
  null,
);

export function HeaderTrailingProvider({ children }: { children: ReactNode }) {
  const [trailing, setTrailingState] = useState<ReactNode>(null);
  const setTrailing = useCallback((next: ReactNode) => {
    setTrailingState(next);
  }, []);

  const value = useMemo(
    () => ({ trailing, setTrailing }),
    [trailing, setTrailing],
  );

  return (
    <HeaderTrailingContext.Provider value={value}>
      {children}
    </HeaderTrailingContext.Provider>
  );
}

function useHeaderTrailingContext() {
  const context = useContext(HeaderTrailingContext);
  if (!context) {
    throw new Error("Header trailing requires HeaderTrailingProvider");
  }
  return context;
}

/** Read registered trailing control (e.g. mobile top bar share). */
export function useHeaderTrailingNode(): ReactNode {
  return useHeaderTrailingContext().trailing;
}

type HeaderTrailingViewport = "mobile" | "desktop" | "all";

/** Renders page-registered trailing control in AppHeader / mobile chrome. */
export function HeaderTrailingSlot({
  className,
  viewport = "desktop",
}: {
  className?: string;
  viewport?: HeaderTrailingViewport;
}) {
  const isMobile = useIsMobile();
  const { trailing } = useHeaderTrailingContext();

  if (!trailing) {
    return null;
  }

  if (viewport === "mobile" && !isMobile) {
    return null;
  }

  if (viewport === "desktop" && isMobile) {
    return null;
  }

  return (
    <div className={cn("pointer-events-auto shrink-0", className)}>
      {trailing}
    </div>
  );
}

/**
 * Registers a trailing control from a page view (mobile top-bar orb,
 * or beside desktop header utilities).
 */
export function HeaderTrailing({ children }: { children: ReactNode }) {
  const { setTrailing } = useHeaderTrailingContext();

  useLayoutEffect(() => {
    setTrailing(children);
    return () => setTrailing(null);
  }, [children, setTrailing]);

  return null;
}
