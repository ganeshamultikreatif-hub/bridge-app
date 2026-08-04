"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface FadeScrollBodyProps {
  children: ReactNode;
  className?: string | undefined;
  empty?: boolean;
  /** Reset scroll position when this value changes. */
  resetKey?: string | number | boolean | null;
  /** Optional slot attribute for CSS hooks (e.g. drawer scroll pads). */
  "data-slot"?: string;
}

const FADE_NONE =
  "[mask-image:linear-gradient(to_bottom,black_0%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_100%)]";

const FADE_BOTTOM =
  "[mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-2.75rem),transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-2.75rem),transparent_100%)]";

const FADE_TOP =
  "[mask-image:linear-gradient(to_bottom,transparent_0%,black_2.75rem,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_2.75rem,black_100%)]";

const FADE_BOTH =
  "[mask-image:linear-gradient(to_bottom,transparent_0%,black_2.75rem,black_calc(100%-2.75rem),transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_2.75rem,black_calc(100%-2.75rem),transparent_100%)]";

/** Scroll body with soft fade at the top/bottom edges when content overflows. */
export function FadeScrollBody({
  children,
  className,
  empty = false,
  resetKey,
  "data-slot": dataSlot,
}: FadeScrollBodyProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const updateFade = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      setShowTopFade(false);
      setShowBottomFade(false);
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = element;
    const remaining = scrollHeight - scrollTop - clientHeight;

    setShowTopFade(scrollTop > 4);
    setShowBottomFade(remaining > 4);
  }, []);

  // resetKey forces re-bind when scroll content identity changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: resetKey is a rebind signal
  useEffect(() => {
    if (empty) {
      setShowTopFade(false);
      setShowBottomFade(false);
      return;
    }

    const element = scrollRef.current;
    if (!element) {
      return;
    }

    element.scrollTop = 0;
    element.scrollLeft = 0;
    updateFade();

    const resizeObserver = new ResizeObserver(() => {
      updateFade();
    });
    resizeObserver.observe(element);

    const mutationObserver = new MutationObserver(() => {
      updateFade();
    });
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [empty, resetKey, updateFade]);

  if (empty) {
    return (
      <div
        className={cn("flex min-h-0 flex-1 flex-col", className)}
        {...(dataSlot ? { "data-slot": dataSlot } : {})}
      >
        {children}
      </div>
    );
  }

  const fadeClass =
    showTopFade && showBottomFade
      ? FADE_BOTH
      : showTopFade
        ? FADE_TOP
        : showBottomFade
          ? FADE_BOTTOM
          : FADE_NONE;

  return (
    <div
      ref={scrollRef}
      data-dialog-scroll=""
      {...(dataSlot ? { "data-slot": dataSlot } : {})}
      onScroll={updateFade}
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain transition-[mask-image,-webkit-mask-image] duration-300 ease-out",
        fadeClass,
        className,
      )}
    >
      {children}
    </div>
  );
}
