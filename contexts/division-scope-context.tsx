"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { ORG_DIVISIONS } from "@/lib/customers/org";

export type DivisionScopeId = "" | string;

interface DivisionScopeContextValue {
  divisionId: DivisionScopeId;
  setDivisionId: (id: DivisionScopeId) => void;
  divisionLabel: string;
  closedChip: { closed: number; target: number } | null;
}

const DivisionScopeContext = createContext<DivisionScopeContextValue | null>(
  null,
);

/** Mock closed vs target by division for header chip. */
const CLOSED_BY_DIVISION: Record<string, { closed: number; target: number }> = {
  marketing: { closed: 14, target: 20 },
  sales: { closed: 22, target: 25 },
  cs: { closed: 9, target: 12 },
  ops: { closed: 5, target: 8 },
};

export function DivisionScopeProvider({ children }: { children: ReactNode }) {
  const [divisionId, setDivisionId] = useState<DivisionScopeId>("");

  const value = useMemo(() => {
    const divisionLabel = divisionId
      ? (ORG_DIVISIONS.find((d) => d.id === divisionId)?.name ?? "Division")
      : "All divisions";

    const closedChip = divisionId
      ? (CLOSED_BY_DIVISION[divisionId] ?? { closed: 0, target: 10 })
      : null;

    return {
      divisionId,
      setDivisionId,
      divisionLabel,
      closedChip,
    };
  }, [divisionId]);

  return (
    <DivisionScopeContext.Provider value={value}>
      {children}
    </DivisionScopeContext.Provider>
  );
}

export function useDivisionScope() {
  const ctx = useContext(DivisionScopeContext);
  if (!ctx) {
    throw new Error("useDivisionScope requires DivisionScopeProvider");
  }
  return ctx;
}
