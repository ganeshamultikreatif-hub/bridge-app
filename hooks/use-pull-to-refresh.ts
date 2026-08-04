"use client";

import { useRouter } from "next/navigation";
import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MOBILE_PULL_REFRESH_HOLD_OFFSET_PX } from "@/config/mobile-pull-refresh";
import { useIsMobileViewport } from "@/hooks/use-is-mobile-viewport";
import { computePullRefreshMetrics } from "@/lib/mobile/compute-pull-refresh-progress";

interface UsePullToRefreshOptions {
  enabled?: boolean;
  onRefresh?: () => void | Promise<void>;
}

interface UsePullToRefreshResult {
  pullProgress: number;
  pullOffsetPx: number;
  isRefreshing: boolean;
}

const REFRESH_HOLD_MS = 500;
const SNAP_TRANSITION = "transform 280ms cubic-bezier(0.32, 0.72, 0, 1)";

function clearPullTransform(el: HTMLElement) {
  el.style.transform = "";
  el.style.transition = "";
}

function setPullTransform(
  el: HTMLElement,
  offsetPx: number,
  withTransition: boolean,
) {
  el.style.transition = withTransition ? SNAP_TRANSITION : "none";
  el.style.transform = offsetPx > 0 ? `translate3d(0, ${offsetPx}px, 0)` : "";
}

export function usePullToRefresh(
  scrollRef: RefObject<HTMLElement | null>,
  options: UsePullToRefreshOptions = {},
): UsePullToRefreshResult {
  const router = useRouter();
  const isMobile = useIsMobileViewport();
  const enabled = (options.enabled ?? true) && isMobile;
  const onRefreshRef = useRef(options.onRefresh);
  onRefreshRef.current = options.onRefresh;

  const [pullProgress, setPullProgress] = useState(0);
  const [pullOffsetPx, setPullOffsetPx] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const trackingRef = useRef(false);
  const startYRef = useRef(0);
  const progressRef = useRef(0);
  const offsetRef = useRef(0);
  const refreshingRef = useRef(false);

  const runRefresh = useCallback(async () => {
    if (refreshingRef.current) {
      return;
    }

    const el = scrollRef.current;
    refreshingRef.current = true;
    setIsRefreshing(true);
    progressRef.current = 1;
    offsetRef.current = MOBILE_PULL_REFRESH_HOLD_OFFSET_PX;
    setPullProgress(1);
    setPullOffsetPx(MOBILE_PULL_REFRESH_HOLD_OFFSET_PX);
    if (el) {
      setPullTransform(el, MOBILE_PULL_REFRESH_HOLD_OFFSET_PX, true);
    }

    try {
      const custom = onRefreshRef.current;
      if (custom) {
        await custom();
      } else {
        router.refresh();
        await new Promise((resolve) => {
          window.setTimeout(resolve, REFRESH_HOLD_MS);
        });
      }
    } finally {
      refreshingRef.current = false;
      setIsRefreshing(false);
      progressRef.current = 0;
      offsetRef.current = 0;
      setPullProgress(0);
      setPullOffsetPx(0);
      if (scrollRef.current) {
        setPullTransform(scrollRef.current, 0, true);
        window.setTimeout(() => {
          if (scrollRef.current && !refreshingRef.current) {
            clearPullTransform(scrollRef.current);
          }
        }, 300);
      }
    }
  }, [router, scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!enabled || !el) {
      return;
    }

    function onTouchStart(event: TouchEvent) {
      if (refreshingRef.current || event.touches.length !== 1) {
        return;
      }

      if ((el?.scrollTop ?? 0) > 1) {
        trackingRef.current = false;
        return;
      }

      trackingRef.current = true;
      startYRef.current = event.touches[0]?.clientY ?? 0;
      progressRef.current = 0;
      offsetRef.current = 0;
    }

    function onTouchMove(event: TouchEvent) {
      if (!trackingRef.current || refreshingRef.current || !el) {
        return;
      }

      if (el.scrollTop > 1) {
        trackingRef.current = false;
        if (offsetRef.current > 0) {
          offsetRef.current = 0;
          progressRef.current = 0;
          setPullProgress(0);
          setPullOffsetPx(0);
          clearPullTransform(el);
        }
        return;
      }

      const clientY = event.touches[0]?.clientY ?? startYRef.current;
      const deltaY = clientY - startYRef.current;
      const metrics = computePullRefreshMetrics(deltaY);

      if (!metrics.engaged) {
        if (offsetRef.current > 0) {
          offsetRef.current = 0;
          progressRef.current = 0;
          setPullProgress(0);
          setPullOffsetPx(0);
          clearPullTransform(el);
        }
        return;
      }

      event.preventDefault();
      progressRef.current = metrics.progress;
      offsetRef.current = metrics.offsetPx;
      setPullProgress(metrics.progress);
      setPullOffsetPx(metrics.offsetPx);
      setPullTransform(el, metrics.offsetPx, false);
    }

    function onTouchEnd() {
      if (!trackingRef.current) {
        return;
      }

      trackingRef.current = false;
      const armed = progressRef.current >= 1;

      if (armed) {
        void runRefresh();
        return;
      }

      progressRef.current = 0;
      offsetRef.current = 0;
      setPullProgress(0);
      setPullOffsetPx(0);
      if (el) {
        setPullTransform(el, 0, true);
        window.setTimeout(() => {
          if (el && !refreshingRef.current && offsetRef.current === 0) {
            clearPullTransform(el);
          }
        }, 300);
      }
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      clearPullTransform(el);
    };
  }, [enabled, runRefresh, scrollRef]);

  useEffect(() => {
    if (enabled) {
      return;
    }

    setPullProgress(0);
    setPullOffsetPx(0);
    trackingRef.current = false;
    progressRef.current = 0;
    offsetRef.current = 0;
    if (scrollRef.current) {
      clearPullTransform(scrollRef.current);
    }
  }, [enabled, scrollRef]);

  return { pullProgress, pullOffsetPx, isRefreshing };
}
