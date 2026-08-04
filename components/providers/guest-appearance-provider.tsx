"use client";

import { WallpaperBackground } from "@/components/shared/wallpaper-background";
import { WallpaperProvider } from "@/components/shared/wallpaper-provider";
import { AppearanceProvider } from "@/contexts/appearance-context";
import { ThemeProvider } from "@/contexts/theme-context";

const GUEST_THEME_STORAGE_KEY = "scheduler-appearance:guest:theme-mode";

interface GuestAppearanceProviderProps {
  children: React.ReactNode;
}

export function GuestAppearanceProvider({
  children,
}: GuestAppearanceProviderProps) {
  return (
    <ThemeProvider
      defaultTheme="system"
      disableTransitionOnChange
      storageKey={GUEST_THEME_STORAGE_KEY}
    >
      <AppearanceProvider userId={null}>
        <WallpaperProvider>
          <WallpaperBackground />
          {children}
        </WallpaperProvider>
      </AppearanceProvider>
    </ThemeProvider>
  );
}
