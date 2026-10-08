import { Quote } from "lucide-react";

import Avatar from "components/Avatar";
import { Feedback } from "types";
import { cn } from "@/lib/utils";

const monthYear = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" });

interface FeedbackQuoteProps {
  feedback: Feedback;
  // the login page: smaller, only the beginning of a long one
  isCompact?: boolean;
  className?: string;
}

// one testimonial: the quote, then who wrote it and when
const FeedbackQuote = ({ feedback, isCompact, className }: FeedbackQuoteProps) => {
  const [name, surname = ""] = feedback.name.split(" ");

  return (
    <figure
      className={cn(
        // a soft highlight under the cursor - not a link, so no pointer
        "flex h-full flex-col rounded-xl border bg-card text-left shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-brand/40 hover:shadow-md",
        isCompact ? "p-4" : "p-6",
        className
      )}
    >
      <Quote className="size-5 shrink-0 fill-brand/15 text-brand" aria-hidden />
      <blockquote
        className={cn(
          "mt-3 flex-1 whitespace-pre-line text-foreground/90",
          isCompact ? "line-clamp-4 text-sm leading-relaxed" : "text-[15px] leading-relaxed"
        )}
      >
        {feedback.message}
      </blockquote>
      <figcaption className={cn("flex items-center gap-3 border-t", isCompact ? "mt-4 pt-3" : "mt-5 pt-4")}>
        <Avatar name={name} surname={surname} className={isCompact ? undefined : "size-9"} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{feedback.name}</span>
          {feedback.role && (
            <span className="block truncate text-xs text-muted-foreground">{feedback.role}</span>
          )}
        </span>
        <time dateTime={feedback.date} className="shrink-0 text-xs text-muted-foreground">
          {monthYear.format(new Date(feedback.date))}
        </time>
      </figcaption>
    </figure>
  );
};

export default FeedbackQuote;
