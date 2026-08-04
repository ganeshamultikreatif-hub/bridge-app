"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useOptionalTheme } from "@/contexts/theme-context";

function readDocumentTheme(): "dark" | "light" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

const Toaster = ({ ...props }: ToasterProps) => {
  const themeContext = useOptionalTheme();
  const [documentTheme, setDocumentTheme] = useState<"dark" | "light">("light");

  useLayoutEffect(() => {
    setDocumentTheme(readDocumentTheme());

    const observer = new MutationObserver(() => {
      setDocumentTheme(readDocumentTheme());
    });

    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  const toasterTheme: NonNullable<ToasterProps["theme"]> =
    themeContext?.resolvedTheme ?? themeContext?.theme ?? documentTheme;

  return (
    <Sonner
      className="toaster group"
      icons={{
        error: <OctagonXIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
        success: <CircleCheckIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
      }}
      mobileOffset={{
        left: "var(--mobile-chrome-gutter)",
        right: "var(--mobile-chrome-gutter)",
        top: "var(--mobile-toast-top)",
      }}
      theme={toasterTheme}
      // Own surface via `.cn-toast` — Sonner's styled bg fights glass tokens,
      // and its transform stack breaks backdrop-filter anyway.
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "cn-toast",
          title: "text-foreground",
          description: "text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
