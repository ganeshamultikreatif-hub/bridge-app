"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/** Gap between header toolbar controls and fixed page tabs (matches header gap-2). */
const TABS_TOP_GAP_PX = 8;

interface FixedPageTabsProps {
  children: React.ReactNode;
  className?: string;
}

interface FixedPageTabsMetrics {
  height: number;
  left: number;
  top: number;
  width: number;
}

/**
 * Desktop: pins page tabs under the floating AppHeader toolbar.
 * Portaled to `document.body` so `position:fixed` is not trapped by glass
 * `backdrop-filter` ancestors (which would offset tabs to the right).
 * Mobile: in document flow — tabs scroll away with page content.
 */
export function FixedPageTabs({ children, className }: FixedPageTabsProps) {
  const isMobile = useIsMobile();
  const anchorRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState<FixedPageTabsMetrics>({
    height: 0,
    left: 0,
    top: 0,
    width: 0,
  });

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  // Re-measure after client mount so portal metrics settle.
  // biome-ignore lint/correctness/useExhaustiveDependencies: mounted gates post-hydration layout
  useLayoutEffect(() => {
    if (isMobile) {
      return;
    }

    const anchor = anchorRef.current;
    if (!anchor) {
      return;
    }

    function update() {
      const toolbar = document.querySelector<HTMLElement>(
        "[data-slot='app-header-toolbar']",
      );
      const header = document.querySelector<HTMLElement>(
        "[data-slot='app-header']",
      );
      const bar = barRef.current;
      const anchor_ = anchorRef.current;
      if (!anchor_) {
        return;
      }

      const toolbarBottom =
        toolbar?.getBoundingClientRect().bottom ??
        header?.getBoundingClientRect().bottom ??
        0;
      const nextTop = toolbarBottom + TABS_TOP_GAP_PX;
      const nextRect = anchor_.getBoundingClientRect();
      const nextHeight = bar?.offsetHeight ?? 0;

      setMetrics((prev) => {
        if (
          prev.top === nextTop &&
          prev.left === nextRect.left &&
          prev.width === nextRect.width &&
          prev.height === nextHeight
        ) {
          return prev;
        }

        return {
          height: nextHeight,
          left: nextRect.left,
          top: nextTop,
          width: nextRect.width,
        };
      });
    }

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(anchor);
    if (barRef.current) {
      resizeObserver.observe(barRef.current);
    }

    const toolbar = document.querySelector("[data-slot='app-header-toolbar']");
    const header = document.querySelector("[data-slot='app-header']");
    if (toolbar) {
      resizeObserver.observe(toolbar);
    }
    if (header) {
      resizeObserver.observe(header);
    }

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("transitionend", update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("transitionend", update);
    };
  }, [isMobile, mounted]);

  if (isMobile) {
    return <div className={cn("w-full min-w-0", className)}>{children}</div>;
  }

  const bar = (
    <div
      className={cn("pointer-events-auto fixed z-15", className)}
      ref={barRef}
      style={{
        left: metrics.left,
        top: metrics.top,
        visibility: metrics.width > 0 ? "visible" : "hidden",
        width: metrics.width,
      }}
    >
      {children}
    </div>
  );

  return (
    <>
      <div
        aria-hidden
        className="w-full shrink-0"
        ref={anchorRef}
        style={{ height: metrics.height || undefined }}
      />
      {mounted ? createPortal(bar, document.body) : null}
    </>
  );
}
