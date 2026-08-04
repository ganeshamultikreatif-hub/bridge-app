"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import type { BreadcrumbItem } from "@/config/breadcrumbs";

type BreadcrumbContextValue = {
  trail: BreadcrumbItem[] | null;
  setTrail: (trail: BreadcrumbItem[] | null) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [trail, setTrail] = useState<BreadcrumbItem[] | null>(null);
  const value = useMemo(() => ({ trail, setTrail }), [trail]);

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbContext() {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error(
      "useBreadcrumbContext must be used within BreadcrumbProvider",
    );
  }

  return context;
}
