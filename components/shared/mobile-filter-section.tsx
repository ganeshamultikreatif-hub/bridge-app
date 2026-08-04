import type { ReactNode } from "react";
import { APP_GROUPED_SURFACE } from "@/config/shared-surfaces";
import { cn } from "@/lib/utils";

interface MobileFilterSectionProps {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Omit to hide the section label. */
  title?: string;
}

/** Grouped block inside a mobile filter drawer. */
export function MobileFilterSection({
  action,
  children,
  className,
  contentClassName,
  title,
}: MobileFilterSectionProps) {
  const showHeader = Boolean(title) || Boolean(action);

  return (
    <section className={cn("shrink-0 space-y-2", className)}>
      {showHeader ? (
        <div className="flex items-center justify-between gap-2 px-0.5">
          {title ? (
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {title}
            </p>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}
      {/* Clip on an inner node — backdrop-filter on the surface breaks overflow. */}
      <div className={cn(APP_GROUPED_SURFACE, "overflow-hidden p-0")}>
        <div className={cn("rounded-[inherit] p-1.5", contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
}
