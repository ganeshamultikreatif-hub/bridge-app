import { cn } from "@/lib/utils";

interface DashboardFrostVeilProps {
  className?: string;
}

/**
 * Full-viewport linear frost for the dashboard — spans behind the sidebar
 * so wallpaper + scrolled content soften under one continuous top scrim.
 */
export function DashboardFrostVeil({ className }: DashboardFrostVeilProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[5] h-36",
          "bg-transparent backdrop-blur-md backdrop-saturate-150",
          "mask-[linear-gradient(to_bottom,black_0%,rgba(0,0,0,0.92)_12%,rgba(0,0,0,0.7)_32%,rgba(0,0,0,0.4)_55%,rgba(0,0,0,0.15)_78%,transparent_100%)]",
          className,
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[5] h-36",
          "bg-linear-to-b from-background/40 via-background/16 to-transparent",
          "dark:from-background/50 dark:via-background/18",
          "mask-[linear-gradient(to_bottom,black_0%,rgba(0,0,0,0.85)_28%,rgba(0,0,0,0.35)_62%,transparent_100%)]",
          className,
        )}
      />
    </>
  );
}
