import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormSectionHeadingProps {
  className?: string;
  description?: string;
  icon?: ReactNode;
  title: string;
  trailing?: ReactNode;
}

/** Section title inside SolidSurface — matches scheduler create/edit forms. */
export function FormSectionHeading({
  className,
  description,
  icon,
  title,
  trailing,
}: FormSectionHeadingProps) {
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      {icon ? (
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border/60">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
