import { createContext, useContext, useState, useCallback, useMemo, PropsWithChildren } from 'react';

export type ThemeMode = 'hacker' | 'professional';

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'professional',
  toggleMode: () => {},
});

const STORAGE_KEY = 'stacksecure-theme-mode';

const getInitialMode = (): ThemeMode => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'hacker' || stored === 'professional') return stored;
  } catch {
    // localStorage unavailable
  }
  return 'professional';
};

export const ThemeModeProvider = ({ children }: PropsWithChildren) => {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'hacker' ? 'professional' : 'hacker';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeMode = () => useContext(ThemeContext);
