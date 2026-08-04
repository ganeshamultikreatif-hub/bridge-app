interface AppThemeProviderProps {
  children: React.ReactNode;
}

/** Root shell only — theme/appearance live in login or dashboard providers. */
export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return children;
}
