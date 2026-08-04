"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import type { ThemeMode } from "@/config/appearance";

interface ThemeContextValue {
  resolvedTheme: "dark" | "light" | undefined;
  setTheme: (theme: ThemeMode) => void;
  theme: ThemeMode | undefined;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  disableTransitionOnChange?: boolean;
  storageKey: string;
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return mode;
}

function applyThemeClass(
  resolved: "light" | "dark",
  disableTransitionOnChange: boolean,
) {
  const root = document.documentElement;

  if (disableTransitionOnChange) {
    root.classList.add("disable-transitions");
  }

  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;

  if (disableTransitionOnChange) {
    window.requestAnimationFrame(() => {
      root.classList.remove("disable-transitions");
    });
  }
}

function readStoredTheme(
  storageKey: string,
  defaultTheme: ThemeMode,
): ThemeMode {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const stored = localStorage.getItem(storageKey);

  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }

  return defaultTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  disableTransitionOnChange = false,
  storageKey,
}: ThemeProviderProps) {
  // Keep SSR and the first client render identical (`undefined`).
  // Stored theme is applied in useLayoutEffect (bootstrap already set html class).
  const [theme, setThemeState] = useState<ThemeMode | undefined>(undefined);
  const [resolvedTheme, setResolvedTheme] = useState<
    "light" | "dark" | undefined
  >(undefined);

  useLayoutEffect(() => {
    const initialTheme = readStoredTheme(storageKey, defaultTheme);
    const initialResolved = resolveTheme(initialTheme);

    setThemeState(initialTheme);
    setResolvedTheme(initialResolved);
    applyThemeClass(initialResolved, disableTransitionOnChange);
  }, [defaultTheme, disableTransitionOnChange, storageKey]);

  useLayoutEffect(() => {
    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange() {
      const nextResolved = resolveTheme("system");
      setResolvedTheme(nextResolved);
      applyThemeClass(nextResolved, disableTransitionOnChange);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [disableTransitionOnChange, theme]);

  const setTheme = useCallback(
    (nextTheme: ThemeMode) => {
      localStorage.setItem(storageKey, nextTheme);
      const nextResolved = resolveTheme(nextTheme);

      setThemeState(nextTheme);
      setResolvedTheme(nextResolved);
      applyThemeClass(nextResolved, disableTransitionOnChange);
    },
    [disableTransitionOnChange, storageKey],
  );

  return (
    <ThemeContext.Provider value={{ resolvedTheme, setTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

export function useOptionalTheme(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
