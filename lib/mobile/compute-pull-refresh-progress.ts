import {
  MOBILE_PULL_REFRESH_ARM_PX,
  MOBILE_PULL_REFRESH_MAX_OFFSET_PX,
  MOBILE_PULL_REFRESH_RESISTANCE,
  MOBILE_PULL_REFRESH_SLOP_PX,
} from "@/config/mobile-pull-refresh";

export interface PullRefreshMetrics {
  /** 0–1 arm progress (0 until past slop). */
  progress: number;
  /** Rubber-band translate in px. */
  offsetPx: number;
  /** True once finger passed the idle dead zone. */
  engaged: boolean;
}

/**
 * Native-style PTR: ignore the first `slop` px from idle, then rubber-band
 * toward `arm` distance for a full refresh.
 */
export function computePullRefreshMetrics(
  deltaY: number,
  options?: {
    slopPx?: number;
    armPx?: number;
    maxOffsetPx?: number;
    resistance?: number;
  },
): PullRefreshMetrics {
  const slopPx = options?.slopPx ?? MOBILE_PULL_REFRESH_SLOP_PX;
  const armPx = options?.armPx ?? MOBILE_PULL_REFRESH_ARM_PX;
  const maxOffsetPx = options?.maxOffsetPx ?? MOBILE_PULL_REFRESH_MAX_OFFSET_PX;
  const resistance = options?.resistance ?? MOBILE_PULL_REFRESH_RESISTANCE;

  if (deltaY <= slopPx || armPx <= 0) {
    return { progress: 0, offsetPx: 0, engaged: false };
  }

  const pastSlop = (deltaY - slopPx) * resistance;
  const offsetPx = Math.min(maxOffsetPx, pastSlop);
  const progress = Math.min(1, pastSlop / armPx);

  return { progress, offsetPx, engaged: true };
}
