"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeContextValue = { theme: Theme; cycleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("xbundle-theme");
    // Older installs may have saved "system". Migrate those to light mode.
    setTheme(savedTheme === "dark" ? "dark" : "light");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("xbundle-theme", theme);
  }, [ready, theme]);

  const cycleTheme = () => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within Providers");
  return context;
}
