import { contactedAgo, isRecentlyContacted } from "helpers/lastContacted";
import { cn } from "@/lib/utils";

// when the candidate got their newest job offer - amber while a new one would be too soon
const LastContacted = ({ date, className }: { date?: string; className?: string }) => {
  if (!date) return <span className={cn("text-muted-foreground", className)}>never</span>;

  return (
    <span
      className={cn(
        isRecentlyContacted(date) ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground",
        className
      )}
    >
      {contactedAgo(date)}
    </span>
  );
};

export default LastContacted;
