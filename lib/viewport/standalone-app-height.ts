import { APP_HEIGHT_CSS_VAR } from "@/config/viewport";

function isIosDevice(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandaloneDisplay(): boolean {
  const nav = window.navigator as Navigator & { standalone?: boolean };

  return (
    nav.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches
  );
}

/**
 * Inline bootstrap snippet — set before first paint.
 * iOS Home Screen PWAs report short `dvh`/`svh`; `vh` equals the real screen.
 */
export function createStandaloneAppHeightBootstrapSnippet(): string {
  return `var standalone=window.navigator.standalone===true||window.matchMedia("(display-mode: standalone)").matches||window.matchMedia("(display-mode: fullscreen)").matches;var ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);if(standalone&&ios){document.documentElement.style.setProperty(${JSON.stringify(APP_HEIGHT_CSS_VAR)},"100vh");}`;
}

/** Re-assert after resume / pageshow (WebKit can drift after keyboard). */
export function applyStandaloneAppHeight(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (isStandaloneDisplay() && isIosDevice()) {
    document.documentElement.style.setProperty(APP_HEIGHT_CSS_VAR, "100vh");
  }
}
