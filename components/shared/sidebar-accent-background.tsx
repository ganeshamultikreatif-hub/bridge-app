import { cn } from "@/lib/utils";

export function SidebarAccentBackground() {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        "group-data-[collapsible=icon]:opacity-80",
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 95% 75% at -8% 108%, color-mix(in srgb, var(--brand) 20%, transparent) 0%, transparent 62%)",
            "radial-gradient(ellipse 55% 45% at 108% -5%, color-mix(in srgb, var(--brand) 7%, transparent) 0%, transparent 52%)",
          ].join(", "),
        }}
      />

      {/* <div
        className={cn(
          "absolute inset-x-3 top-[30%] bottom-[24%] opacity-70",
          "group-data-[collapsible=icon]:hidden",
        )}
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--sidebar-foreground) 14%, transparent) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        }}
      /> */}
    </div>
  );
}
