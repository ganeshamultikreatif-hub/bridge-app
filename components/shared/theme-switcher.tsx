"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HEADER_TOOLBAR_GLYPH } from "@/config/header-toolbar";
import { useTheme } from "@/contexts/theme-context";
import { Moon, Sun } from "@/lib/icons";

const THEME_META = {
  light: { icon: Sun, label: "Mode terang" },
  dark: { icon: Moon, label: "Mode gelap" },
} as const;

type DisplayTheme = keyof typeof THEME_META;

function toDisplayTheme(
  theme: "dark" | "light" | "system",
  resolvedTheme: "dark" | "light" | undefined,
): DisplayTheme {
  if (theme === "system") {
    return resolvedTheme ?? "light";
  }

  return theme;
}

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !theme) {
    return (
      <Button
        aria-hidden
        className="size-9 shrink-0 rounded-xl"
        disabled
        size="icon"
        type="button"
        variant="ghost"
      />
    );
  }

  const displayTheme = toDisplayTheme(theme, resolvedTheme);
  const current = THEME_META[displayTheme];
  const Icon = current.icon;

  function handleClick() {
    setTheme(displayTheme === "light" ? "dark" : "light");
  }

  return (
    <Button
      aria-label={current.label}
      className="size-9 shrink-0 rounded-xl"
      onClick={handleClick}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Icon className={HEADER_TOOLBAR_GLYPH} aria-hidden="true" />
    </Button>
  );
}
