"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useEffect, useRef } from "react";
import { WallpaperBootLayer } from "@/components/shared/wallpaper-boot-layer";
import { createRootAppearanceBootstrapScript } from "@/lib/appearance/bootstrap-script";
import { applyStandaloneAppHeight } from "@/lib/viewport/standalone-app-height";

const BOOTSTRAP_SCRIPT = createRootAppearanceBootstrapScript();

/**
 * Boot wallpaper DOM + inject blocking appearance script via the SSR HTML
 * stream (not a React-rendered <script>) to avoid React 19 warnings / FOUC.
 */
export function RootAppearanceBootstrap() {
  const inserted = useRef(false);

  useServerInsertedHTML(() => {
    if (inserted.current) {
      return null;
    }

    inserted.current = true;

    return (
      // biome-ignore lint/security/noDangerouslySetInnerHtml: FOUC bootstrap before hydration
      <script
        id="scheduler-appearance-bootstrap"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: FOUC bootstrap before hydration
        dangerouslySetInnerHTML={{ __html: BOOTSTRAP_SCRIPT }}
      />
    );
  });

  useEffect(() => {
    applyStandaloneAppHeight();

    const onPageShow = () => {
      applyStandaloneAppHeight();
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return <WallpaperBootLayer />;
}
