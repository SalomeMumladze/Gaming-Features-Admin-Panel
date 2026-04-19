import { useState, useEffect } from "react";

export type Mode = "light" | "dark";

const STORAGE_KEY = "admin-theme-mode";

export const useThemeMode = () => {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (saved === "light" || saved === "dark") {
      setMode(saved);
    }
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return { mode, toggleMode };
};