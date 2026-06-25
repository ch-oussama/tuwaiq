"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 border border-border rounded-full" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2.5 rounded-full text-foreground hover:bg-foreground hover:text-background border border-transparent transition-all relative overflow-hidden group"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <Sun size={20} className="animate-in fade-in zoom-in spin-in-180 duration-500" />
      ) : (
        <Moon size={20} className="animate-in fade-in zoom-in spin-in-180 duration-500" />
      )}
    </button>
  );
}
