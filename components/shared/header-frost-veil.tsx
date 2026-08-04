import { cn } from "@/lib/utils";

interface HeaderFrostVeilProps {
  className?: string;
  /**
   * `fade` — soft linear mask + wash (default elsewhere).
   * `none` — skip (e.g. dashboard uses shell-level full-bleed veil).
   */
  variant?: "fade" | "none";
}

/** Frosted header veil so scrolled content stays readable under chrome. */
export function HeaderFrostVeil({
  className,
  variant = "fade",
}: HeaderFrostVeilProps) {
  if (variant === "none") {
    return null;
  }

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-transparent max-md:backdrop-blur-none md:backdrop-blur-xs md:backdrop-saturate-125",
          "mask-[linear-gradient(to_bottom,black_0%,rgba(0,0,0,0.85)_18%,rgba(0,0,0,0.55)_38%,rgba(0,0,0,0.28)_58%,rgba(0,0,0,0.1)_78%,transparent_100%)]",
          className,
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -z-10 h-28",
          "bg-linear-to-b from-background/35 via-background/12 to-transparent",
          "dark:from-background/45 dark:via-background/14",
          className,
        )}
      />
    </>
  );
}
