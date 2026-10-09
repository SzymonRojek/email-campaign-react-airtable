import { cn } from "@/lib/utils";

// the same name always gets the same colour
const palette = [
  "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  // amber-700 is too light on its background (contrast 4.48:1) - 800 passes 4.5:1
  "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "bg-teal-500/15 text-teal-700 dark:text-teal-300",
];

const colourOf = (text: string) =>
  palette[[...text].reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length];

const initialsOf = (name = "", surname = "") =>
  `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase() || "?";

interface AvatarProps {
  name?: string;
  surname?: string;
  className?: string;
}

const Avatar = ({ name = "", surname = "", className }: AvatarProps) => (
  <span
    aria-hidden
    className={cn(
      "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
      colourOf(`${name}${surname}`),
      className
    )}
  >
    {initialsOf(name, surname)}
  </span>
);

export default Avatar;
