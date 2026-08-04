"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

type CloseFn = () => void;

interface DrawerStackContextValue {
  register: (close: CloseFn) => () => void;
  closeAll: () => void;
}

const DrawerStackContext = createContext<DrawerStackContextValue | null>(null);

export function DrawerStackProvider({ children }: { children: ReactNode }) {
  const closersRef = useRef(new Map<number, CloseFn>());
  const nextIdRef = useRef(0);

  const register = useCallback((close: CloseFn) => {
    const id = nextIdRef.current;
    nextIdRef.current += 1;
    closersRef.current.set(id, close);
    return () => {
      closersRef.current.delete(id);
    };
  }, []);

  const closeAll = useCallback(() => {
    for (const close of [...closersRef.current.values()].reverse()) {
      close();
    }
  }, []);

  const value = useMemo(() => ({ register, closeAll }), [closeAll, register]);

  return (
    <DrawerStackContext.Provider value={value}>
      {children}
    </DrawerStackContext.Provider>
  );
}

export function useDrawerStack(): DrawerStackContextValue | null {
  return useContext(DrawerStackContext);
}

/** Provide a stack if the parent didn't — keeps nested pickers self-contained. */
export function EnsureDrawerStack({ children }: { children: ReactNode }) {
  const existing = useDrawerStack();
  if (existing) {
    return children;
  }

  return <DrawerStackProvider>{children}</DrawerStackProvider>;
}

export function useRegisterDrawerCloser(close: CloseFn, open: boolean): void {
  const stack = useDrawerStack();
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!stack || !open) {
      return;
    }

    return stack.register(() => {
      closeRef.current();
    });
  }, [open, stack]);
}

/** Outside-press dismiss reasons (Base UI); vaul callers may omit. */
export function isOutsideDrawerDismiss(reason: string | undefined): boolean {
  return reason === "outside-press";
}
