"use client";

import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface FixedViewportPortalProps {
  children: ReactNode;
}

/**
 * Renders fixed UI on `document.body` — matches wang.
 * iOS PWA / Safari treat `position:fixed` + `backdrop-filter` inside
 * `overflow:hidden` ancestors as clipped or opaque; bottom-nav liquid glass
 * needs a clean viewport backdrop sample.
 */
export function FixedViewportPortal({ children }: FixedViewportPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(children, document.body);
}
