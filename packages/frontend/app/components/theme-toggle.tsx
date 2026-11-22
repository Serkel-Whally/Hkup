"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../providers";

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();
  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:border-sky-400 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-700 dark:hover:bg-slate-800"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <Icon aria-hidden="true" size={18} />
    </button>
  );
}
