"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../providers";

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();
  const Icon = theme === "system" ? Monitor : theme === "dark" ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      aria-label={`Color theme: ${theme}. Activate to change theme.`}
      title={`Color theme: ${theme}`}
    >
      <Icon aria-hidden="true" size={18} />
    </button>
  );
}
