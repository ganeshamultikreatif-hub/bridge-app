"use client";

import type { ReactNode } from "react";
import { FadeScrollBody } from "@/components/shared/fade-scroll-body";

interface DashboardScrollableBodyProps {
  children: ReactNode;
  className?: string;
  empty?: boolean;
}

export function DashboardScrollableBody({
  children,
  className,
  empty = false,
}: DashboardScrollableBodyProps) {
  return (
    <FadeScrollBody className={className} empty={empty}>
      {children}
    </FadeScrollBody>
  );
}
