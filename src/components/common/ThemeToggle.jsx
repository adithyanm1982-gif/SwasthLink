import { Sun, Moon } from "lucide-react";
import { useApp } from "../../lib/store";
import { cn } from "../../lib/utils";

// Dark / light switch. The choice is saved and applied to every page of the site.
export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useApp();
  const dark = theme === "dark";
  return (
    <button type="button" onClick={toggleTheme} aria-pressed={dark} title={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn("press grid h-8 w-8 place-items-center border border-zinc-300 hover:border-black", className)}>
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
