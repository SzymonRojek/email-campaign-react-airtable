import { Monitor, Moon, Sun } from "lucide-react";

import { Theme, useTheme } from "contexts/ThemeContext";
import { cn } from "@/lib/utils";

const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

// light / dark / like the operating system
const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn("inline-flex rounded-lg border bg-muted/60 p-0.5", className)}
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          onClick={() => setTheme(value)}
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            theme === value && "bg-background text-foreground shadow-sm"
          )}
        >
          <Icon className="size-4" aria-hidden />
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
