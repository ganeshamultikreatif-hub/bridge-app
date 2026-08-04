import { RADIUS_INNER } from "@/config/shape";
import { cn } from "@/lib/utils";

interface SolidSurfaceProps {
  children: React.ReactNode;
  className?: string;
}

/** Opaque card inside the glass dashboard shell — readable nested surface. */
export function SolidSurface({ children, className }: SolidSurfaceProps) {
  return (
    <div
      className={cn(
        RADIUS_INNER,
        "border border-border/50 bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
