"use client";

import Link from "next/link";
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
  HEADER_TOOLBAR_GLYPH,
  HEADER_TOOLBAR_ICON_BUTTON,
} from "@/config/header-toolbar";
import { MOBILE_TOP_BAR_ORB_BUTTON } from "@/config/mobile-chrome";
import { APP_GLASS_SURFACE } from "@/config/shared-surfaces";
import { useIsMobile } from "@/hooks/use-mobile";
import { CaretLeftIcon, ChevronLeft } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface HeaderLeadingContextValue {
  leading: ReactNode;
  setLeading: (leading: ReactNode) => void;
}

const HeaderLeadingContext = createContext<HeaderLeadingContextValue | null>(
  null,
);

export function HeaderLeadingProvider({ children }: { children: ReactNode }) {
  const [leading, setLeadingState] = useState<ReactNode>(null);
  const setLeading = useCallback((next: ReactNode) => {
    setLeadingState(next);
  }, []);

  const value = useMemo(() => ({ leading, setLeading }), [leading, setLeading]);

  return (
    <HeaderLeadingContext.Provider value={value}>
      {children}
    </HeaderLeadingContext.Provider>
  );
}

function useHeaderLeadingContext() {
  const context = useContext(HeaderLeadingContext);
  if (!context) {
    throw new Error("Header leading requires HeaderLeadingProvider");
  }
  return context;
}

/** Read registered leading control (e.g. mobile top bar). */
export function useHeaderLeadingNode(): ReactNode {
  return useHeaderLeadingContext().leading;
}

type HeaderLeadingViewport = "mobile" | "desktop" | "all";

/** Renders page-registered leading control (e.g. back) before breadcrumbs. */
export function HeaderLeadingSlot({
  className,
  viewport = "desktop",
}: {
  className?: string;
  viewport?: HeaderLeadingViewport;
}) {
  const isMobile = useIsMobile();
  const { leading } = useHeaderLeadingContext();

  if (!leading) {
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
      {leading}
    </div>
  );
}

/**
 * Registers a leading control from a page view so it sits in AppHeader
 * before breadcrumbs / page name.
 */
export function HeaderLeading({ children }: { children: ReactNode }) {
  const { setLeading } = useHeaderLeadingContext();

  useLayoutEffect(() => {
    setLeading(children);
    return () => setLeading(null);
  }, [children, setLeading]);

  return null;
}

interface HeaderBackButtonProps {
  href: string;
  label: string;
}

/**
 * Back control — desktop glass pill in AppHeader, wang liquid-glass orb on mobile.
 */
export function HeaderBackButton({ href, label }: HeaderBackButtonProps) {
  return (
    <HeaderLeading>
      <>
        <div
          className={cn(
            "hidden h-11 items-center rounded-full p-1 hover:bg-muted/45 md:flex dark:hover:bg-muted/30",
            APP_GLASS_SURFACE,
          )}
        >
          <Link
            aria-label={label}
            className={cn(
              HEADER_TOOLBAR_ICON_BUTTON,
              "inline-flex items-center justify-center text-foreground",
            )}
            href={href}
            scroll={false}
          >
            <ChevronLeft className={HEADER_TOOLBAR_GLYPH} aria-hidden="true" />
          </Link>
        </div>
        <Link
          aria-label={label}
          className={cn("md:hidden", MOBILE_TOP_BAR_ORB_BUTTON)}
          href={href}
          scroll={false}
        >
          <CaretLeftIcon aria-hidden="true" />
        </Link>
      </>
    </HeaderLeading>
  );
}
