"use client";

import { Link2 } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
}

/** Bridge brand mark — SF Symbol for now (not Scheduler system-logo). */
export function AppLogo({ className }: AppLogoProps) {
  return <Link2 aria-hidden="true" className={cn("shrink-0", className)} />;
}
