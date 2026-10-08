import Avatar from "components/Avatar";
import { Feedback } from "types";
import { cn } from "@/lib/utils";

const monthYear = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" });

interface FeedbackQuoteProps {
  feedback: Feedback;
  // the login page shows only the beginning of a long one
  isShort?: boolean;
  className?: string;
}

const FeedbackQuote = ({ feedback, isShort, className }: FeedbackQuoteProps) => {
  const [name, surname = ""] = feedback.name.split(" ");

  return (
    <figure className={cn("flex flex-col gap-3 rounded-xl border bg-card p-4 text-left", className)}>
      <blockquote className={cn("text-sm whitespace-pre-line", isShort && "line-clamp-3")}>
        “{feedback.message}”
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-2.5">
        <Avatar name={name} surname={surname} />
        <span className="min-w-0 text-xs">
          <span className="block truncate font-medium">{feedback.name}</span>
          <span className="block truncate text-muted-foreground">
            {[feedback.role, monthYear.format(new Date(feedback.date))].filter(Boolean).join(" · ")}
          </span>
        </span>
      </figcaption>
    </figure>
  );
};

export default FeedbackQuote;
