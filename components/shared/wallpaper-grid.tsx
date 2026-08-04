"use client";

import { WallpaperOption } from "@/components/shared/wallpaper-option";
import { useWallpaper } from "@/components/shared/wallpaper-provider";
import { WALLPAPER_GRID_GAP } from "@/config/settings-layout";
import { WALLPAPERS } from "@/config/wallpapers";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";
import { listFilledCustomWallpaperSlots } from "@/lib/wallpaper/custom-wallpaper";
import {
  applyWallpaperTheme,
  resolveCustomWallpaper,
} from "@/lib/wallpaper/resolve-wallpaper";

export function WallpaperGrid() {
  const { resolvedTheme } = useTheme();
  const resolvedDark = resolvedTheme === "dark";
  const {
    wallpaperId,
    customWallpaperSlots,
    setWallpaperId,
    removeCustomWallpaper,
  } = useWallpaper();
  const customWallpapers = listFilledCustomWallpaperSlots(customWallpaperSlots);

  return (
    <div className={cn("grid grid-cols-2", WALLPAPER_GRID_GAP)}>
      {customWallpapers.map(({ slot, url }) => {
        const wallpaper = resolveCustomWallpaper(url, slot);

        return (
          <WallpaperOption
            key={wallpaper.id}
            wallpaper={wallpaper}
            selected={wallpaperId === wallpaper.id}
            onSelect={setWallpaperId}
            onRemove={() => removeCustomWallpaper(slot)}
          />
        );
      })}
      {WALLPAPERS.map((wallpaper) => {
        const themed = applyWallpaperTheme(wallpaper, resolvedDark);

        return (
          <WallpaperOption
            key={wallpaper.id}
            wallpaper={themed}
            selected={wallpaperId === wallpaper.id}
            onSelect={setWallpaperId}
          />
        );
      })}
    </div>
  );
}
