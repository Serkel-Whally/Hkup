"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ThemeContextValue = { theme: Theme; cycleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("xbundle-theme");
    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
      setTheme(savedTheme);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
      const isDark = theme === "dark" || (theme === "system" && mediaQuery.matches);
      document.documentElement.classList.toggle("dark", isDark);
    };

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);
    window.localStorage.setItem("xbundle-theme", theme);

    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [ready, theme]);

  const cycleTheme = () => {
    setTheme((currentTheme) => {
      if (currentTheme === "system") return "light";
      if (currentTheme === "light") return "dark";
      return "system";
    });
  };

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
