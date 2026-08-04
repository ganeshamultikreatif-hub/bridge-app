"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AppUser } from "@/types/user";

interface CurrentUserContextValue {
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

interface CurrentUserProviderProps {
  children: React.ReactNode;
  currentUser: AppUser;
}

export function CurrentUserProvider({
  children,
  currentUser: initialUser,
}: CurrentUserProviderProps) {
  const [currentUser, setCurrentUserState] = useState(initialUser);

  useEffect(() => {
    setCurrentUserState(initialUser);
  }, [initialUser]);

  const setCurrentUser = useCallback((user: AppUser) => {
    setCurrentUserState(user);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
    }),
    [currentUser, setCurrentUser],
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUserContextValue {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within CurrentUserProvider");
  }
  return context;
}
