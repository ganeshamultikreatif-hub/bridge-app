"use client";

import { WallpaperBackground } from "@/components/shared/wallpaper-background";
import { WallpaperProvider } from "@/components/shared/wallpaper-provider";
import { AppearanceProvider } from "@/contexts/appearance-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { getThemeStorageKey } from "@/lib/appearance/storage";
import type { UserId } from "@/types/user";

interface UserAppearanceProviderProps {
  children: React.ReactNode;
  userId: UserId;
}

export function UserAppearanceProvider({
  children,
  userId,
}: UserAppearanceProviderProps) {
  return (
    <ThemeProvider
      defaultTheme="system"
      disableTransitionOnChange
      storageKey={getThemeStorageKey(userId)}
    >
      <AppearanceProvider userId={userId}>
        <WallpaperProvider>
          <WallpaperBackground />
          {children}
        </WallpaperProvider>
      </AppearanceProvider>
    </ThemeProvider>
  );
}
