"use client";

import { useEffect } from "react";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { SolidSurface } from "@/components/shared/solid-surface";
import type { SidebarAppIconTone } from "@/config/sidebar";
import type { AppIcon } from "@/lib/icons";
import { GlobeIcon } from "@/lib/icons";

interface SuiteHandoffProps {
  title: string;
  url: string;
  imageSrc: string;
  imageMask?: boolean;
  tone: SidebarAppIconTone;
  icon?: AppIcon;
}

/**
 * Soft handoff: Next.js route first (same shell), then continue to external origin.
 */
export function SuiteHandoff({
  title,
  url,
  imageSrc,
  imageMask = false,
  tone,
  icon = GlobeIcon,
}: SuiteHandoffProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      window.location.replace(url);
    }, 280);

    return () => window.clearTimeout(timeoutId);
  }, [url]);

  return (
    <div className="flex min-h-[50dvh] items-center justify-center p-4">
      <SolidSurface className="flex w-full max-w-sm flex-col items-center gap-3 p-6 text-center md:p-8">
        <SidebarAppIcon
          icon={icon}
          imageSrc={imageSrc}
          imageMask={imageMask}
          size="dock"
          tone={tone}
        />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">Opening…</p>
        </div>
        <a
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          href={url}
        >
          Continue now
        </a>
      </SolidSurface>
    </div>
  );
}
