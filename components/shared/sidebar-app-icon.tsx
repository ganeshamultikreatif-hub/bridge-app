"use client";

import Image from "next/image";
import { type AppIconStyle, DEFAULT_APP_ICON_STYLE } from "@/config/appearance";
import {
  getSidebarAppIconTone,
  SIDEBAR_APP_ICON_GLYPH_SHADOW_COLORED,
  SIDEBAR_APP_ICON_GLYPH_SIZE,
  SIDEBAR_APP_ICON_SHELL,
  SIDEBAR_DOCK_APP_ICON_GLYPH_SIZE,
  SIDEBAR_DOCK_APP_ICON_SHELL,
  type SidebarAppIconTone,
} from "@/config/sidebar";
import { useOptionalAppearance } from "@/contexts/appearance-context";
import type { AppIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface SidebarAppIconProps {
  icon: AppIcon;
  tone: SidebarAppIconTone;
  className?: string;
  /**
   * Full-color app mark — keeps original colors, no tone recolor.
   * Sized slightly larger than SF glyphs inside the same shell.
   */
  imageSrc?: string;
  /** Monochrome PNG used as CSS mask (glyph recolors with shell). */
  imageMask?: boolean;
  /** `menu` = System Settings scale; `dock` = header / collapsed rail. */
  size?: "menu" | "dock";
  style?: AppIconStyle;
}

export function SidebarAppIcon({
  icon: IconComponent,
  tone,
  className,
  imageSrc,
  imageMask = false,
  size = "menu",
  style,
}: SidebarAppIconProps) {
  const appearance = useOptionalAppearance();
  const isDock = size === "dock";
  const resolvedStyle =
    style ?? appearance?.appIconStyle ?? DEFAULT_APP_ICON_STYLE;
  const { shell, glyph } = getSidebarAppIconTone(tone, resolvedStyle);
  const shellClass = isDock
    ? SIDEBAR_DOCK_APP_ICON_SHELL
    : SIDEBAR_APP_ICON_SHELL;
  /** Full-bleed suite marks (Scheduler / CMS) — fill the squircle. */
  const imagePx = isDock ? 36 : 22;
  const maskSize = isDock ? "size-10" : "size-7";

  return (
    <span
      className={cn(
        shellClass,
        // Photo logos keep the app-icon shell surface (transparent PNG shows through).
        // Mask logos also use the tone shell for glyph recolor.
        shell,
        imageSrc && "overflow-hidden",
        className,
      )}
    >
      {imageSrc && imageMask ? (
        <span
          aria-hidden="true"
          className={cn("shrink-0 bg-current", maskSize, glyph)}
          style={{
            maskImage: `url(${imageSrc})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskImage: `url(${imageSrc})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
          }}
        />
      ) : imageSrc ? (
        <Image
          alt=""
          aria-hidden="true"
          className="size-full object-contain p-[1px]"
          height={imagePx}
          src={imageSrc}
          unoptimized
          width={imagePx}
        />
      ) : (
        <IconComponent
          className={cn(
            isDock
              ? SIDEBAR_DOCK_APP_ICON_GLYPH_SIZE
              : SIDEBAR_APP_ICON_GLYPH_SIZE,
            glyph,
            resolvedStyle === "colored" &&
              SIDEBAR_APP_ICON_GLYPH_SHADOW_COLORED,
          )}
        />
      )}
    </span>
  );
}
