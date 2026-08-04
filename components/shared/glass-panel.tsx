import { GLASS_SHELL_SURFACE } from "@/config/glass";
import { RADIUS_OUTER } from "@/config/shape";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div
      className={cn(
        RADIUS_OUTER,
        GLASS_SHELL_SURFACE,
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
