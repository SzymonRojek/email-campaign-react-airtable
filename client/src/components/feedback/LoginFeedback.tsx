import { useState } from "react";
import { MessageSquareQuote } from "lucide-react";

import { useFeedback } from "customHooks/queries";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FeedbackDialog from "./FeedbackDialog";
import FeedbackQuote from "./FeedbackQuote";

// the newest ones only - all of them are on the Feedback page in the app
const SHOWN = 3;

const columns = ["mx-auto max-w-sm", "sm:grid-cols-2 max-w-2xl mx-auto", "md:grid-cols-3"];

// under the login: what reviewers say (only when there is something) and the invitation
const LoginFeedback = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: feedback = [] } = useFeedback();
  const shown = feedback.slice(0, SHOWN);

  return (
    <section
      {...(shown.length ? { "aria-labelledby": "reviewers-heading" } : { "aria-label": "Feedback" })}
      className="mt-14 grid w-full max-w-4xl gap-5"
    >
      {shown.length > 0 && (
        <>
          <h2
            id="reviewers-heading"
            className="text-center text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            What reviewers say
          </h2>
          <div className={cn("grid w-full gap-4", columns[shown.length - 1])}>
            {shown.map((item) => (
              <FeedbackQuote key={item.id} feedback={item} isCompact className="bg-card/70" />
            ))}
          </div>
        </>
      )}
      <Button
        variant="link"
        className="justify-self-center text-muted-foreground"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquareQuote />
        Reviewing this project? Leave feedback
      </Button>
      <FeedbackDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  );
};

export default LoginFeedback;
