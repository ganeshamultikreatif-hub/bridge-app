"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import { isMobileTopBlurActive } from "@/lib/mobile/is-mobile-top-blur-active";

export interface MobileLargeTitleScrollState {
  showBlur: boolean;
  showCompactTitle: boolean;
}

export function useMobileLargeTitleScroll(
  resolveScrollElement: () => HTMLElement | null,
  titleRef: RefObject<HTMLElement | null>,
  options?: { enabled?: boolean; observeKey?: string | number },
): MobileLargeTitleScrollState {
  const enabled = options?.enabled ?? true;
  const observeKey = options?.observeKey ?? 0;
  const [showBlur, setShowBlur] = useState(false);
  const [showCompactTitle, setShowCompactTitle] = useState(false);
  const resolveRef = useRef(resolveScrollElement);
  resolveRef.current = resolveScrollElement;

  // observeKey re-attaches observers when layout identity changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: observeKey is a rebind signal
  useEffect(() => {
    if (!enabled) {
      setShowBlur(false);
      setShowCompactTitle(false);
      return;
    }

    setShowCompactTitle(false);

    let scrollElement: HTMLElement | null = null;
    let frameId = 0;
    let scrollAttached = false;
    let observer: IntersectionObserver | null = null;

    const onScroll = () => {
      if (scrollElement) {
        setShowBlur(isMobileTopBlurActive(scrollElement, "top"));
      }
    };

    const attachTitleObserver = () => {
      const titleElement = titleRef.current;
      if (!scrollElement || !titleElement || observer) {
        return Boolean(titleElement);
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          setShowCompactTitle(!entry?.isIntersecting);
        },
        { root: scrollElement, threshold: 0 },
      );
      observer.observe(titleElement);
      return true;
    };

    const attach = () => {
      scrollElement = resolveRef.current();
      if (!scrollElement) {
        return false;
      }

      if (!scrollAttached) {
        scrollAttached = true;
        onScroll();
        scrollElement.addEventListener("scroll", onScroll, { passive: true });
      }

      return attachTitleObserver();
    };

    frameId = requestAnimationFrame(() => {
      if (!attach()) {
        frameId = requestAnimationFrame(() => {
          if (!attach()) {
            frameId = requestAnimationFrame(attach);
          }
        });
      }
    });

    return () => {
      cancelAnimationFrame(frameId);
      observer?.disconnect();
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", onScroll);
      }
    };
  }, [enabled, observeKey, titleRef]);

  return { showBlur, showCompactTitle };
}
