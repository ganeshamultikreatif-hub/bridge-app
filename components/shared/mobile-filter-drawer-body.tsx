import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileFilterDrawerBodyProps {
  children: ReactNode;
  className?: string;
}

/** Column shell for mobile-native filter drawer bodies (parent scrolls). */
export function MobileFilterDrawerBody({
  children,
  className,
}: MobileFilterDrawerBodyProps) {
  return (
    <div className={cn("flex flex-col gap-4 pb-1", className)}>{children}</div>
  );
}
