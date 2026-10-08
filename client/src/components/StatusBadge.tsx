import { cn } from "@/lib/utils";

// soft colours with a dot - readable in both themes without shouting
const tones = {
  green: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-300 dark:ring-emerald-400/25",
  amber: "bg-amber-500/10 text-amber-700 ring-amber-600/25 dark:text-amber-300 dark:ring-amber-400/25",
  red: "bg-red-500/10 text-red-700 ring-red-600/20 dark:text-red-300 dark:ring-red-400/25",
  grey: "bg-muted text-muted-foreground ring-border",
};

const dots = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  grey: "bg-muted-foreground",
};

const toneOf: Record<string, keyof typeof tones> = {
  active: "green",
  sent: "green",
  pending: "amber",
  draft: "amber",
  blocked: "red",
  // left by themselves - grey, not an error like "blocked"
  unsubscribed: "grey",
};

const StatusBadge = ({ status }: { status: string }) => {
  const tone = toneOf[status] ?? "grey";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
        tones[tone]
      )}
    >
      <span className={cn("size-1.5 rounded-full", dots[tone])} aria-hidden />
      {status}
    </span>
  );
};

export default StatusBadge;
