import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

// the same key as the script in index.html (it applies the theme before React starts)
const STORAGE_KEY = "theme";
const darkQuery = "(prefers-color-scheme: dark)";

const readTheme = (): Theme => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
};

const systemIsDark = () =>
  typeof window.matchMedia === "function" && window.matchMedia(darkQuery).matches;

interface ThemeContextValue {
  theme: Theme;
  // what is really shown - "system" resolved to light or dark
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(readTheme);
  const [isSystemDark, setIsSystemDark] = useState(systemIsDark);

  // "system" follows the operating system also after a change
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const query = window.matchMedia(darkQuery);
    const onChange = () => setIsSystemDark(query.matches);

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme =
    theme === "dark" || (theme === "system" && isSystemDark) ? "dark" : "light";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // no localStorage (e.g. private mode) - the choice lasts until a reload
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) throw new Error("useTheme must be used inside ThemeProvider");

  return context;
};
