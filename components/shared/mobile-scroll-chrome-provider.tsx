"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

export interface MobileScrollChromeSnapshot {
  title: string;
  showBlur: boolean;
  showCompactTitle: boolean;
}

interface MobileScrollChromeContextValue {
  snapshot: MobileScrollChromeSnapshot | null;
  setOwnerSnapshot: (
    ownerId: string,
    snapshot: MobileScrollChromeSnapshot | null,
  ) => void;
}

const MobileScrollChromeContext =
  createContext<MobileScrollChromeContextValue | null>(null);

export function MobileScrollChromeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [snapshots, setSnapshots] = useState<
    ReadonlyMap<string, MobileScrollChromeSnapshot>
  >(() => new Map());

  const setOwnerSnapshot = useCallback(
    (ownerId: string, snapshot: MobileScrollChromeSnapshot | null) => {
      setSnapshots((current) => {
        if (!snapshot) {
          if (!current.has(ownerId)) {
            return current;
          }

          const next = new Map(current);
          next.delete(ownerId);
          return next;
        }

        const next = new Map(current);
        next.set(ownerId, snapshot);
        return next;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      snapshot: [...snapshots.values()].at(-1) ?? null,
      setOwnerSnapshot,
    }),
    [setOwnerSnapshot, snapshots],
  );

  return (
    <MobileScrollChromeContext.Provider value={value}>
      {children}
    </MobileScrollChromeContext.Provider>
  );
}

function useMobileScrollChromeContext(): MobileScrollChromeContextValue {
  const context = useContext(MobileScrollChromeContext);
  if (!context) {
    throw new Error(
      "useSyncMobileScrollChrome must be used within MobileScrollChromeProvider",
    );
  }

  return context;
}

export function useSyncMobileScrollChrome(
  title: string | undefined,
  showBlur: boolean,
  showCompactTitle: boolean,
): void {
  const { setOwnerSnapshot } = useMobileScrollChromeContext();
  const ownerId = useId();

  useEffect(() => {
    setOwnerSnapshot(
      ownerId,
      title ? { title, showBlur, showCompactTitle } : null,
    );
    return () => setOwnerSnapshot(ownerId, null);
  }, [ownerId, setOwnerSnapshot, showBlur, showCompactTitle, title]);
}

export function useMobileScrollChromeSnapshot(): MobileScrollChromeSnapshot | null {
  const context = useContext(MobileScrollChromeContext);
  return context?.snapshot ?? null;
}
