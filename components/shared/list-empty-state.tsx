import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { cn } from "@/lib/utils";

interface ListEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  compact?: boolean;
}

export function ListEmptyState({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
  className,
  compact = false,
}: ListEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "px-4 py-8" : cn(APP_PANEL_SURFACE, "rounded-2xl px-6 py-16"),
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <p
        className={cn(
          "font-semibold",
          compact ? "mt-3 text-sm" : "mt-4 text-base",
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          "max-w-sm text-muted-foreground",
          compact ? "mt-1 text-xs leading-relaxed" : "mt-1 text-sm",
        )}
      >
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Button asChild size={compact ? "sm" : "default"} className="mt-4">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
