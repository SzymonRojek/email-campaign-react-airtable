import { useState } from "react";
import { MessageSquareQuote } from "lucide-react";

import { useFeedback } from "customHooks/queries";
import { Button } from "@/components/ui/button";
import FeedbackDialog from "./FeedbackDialog";
import FeedbackQuote from "./FeedbackQuote";

const SHOWN = 2;

// under the login: what reviewers say (only when there is something) and the invitation
const LoginFeedback = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: feedback = [] } = useFeedback();
  const shown = feedback.slice(0, SHOWN);

  return (
    <section aria-label="Feedback from reviewers" className="mt-10 grid w-full max-w-2xl gap-4">
      {shown.length > 0 && (
        <div className={shown.length > 1 ? "grid gap-3 sm:grid-cols-2" : "mx-auto grid w-full max-w-sm"}>
          {shown.map((item) => (
            <FeedbackQuote key={item.id} feedback={item} isShort className="bg-card/60" />
          ))}
        </div>
      )}
      <Button variant="link" className="justify-self-center text-muted-foreground" onClick={() => setIsOpen(true)}>
        <MessageSquareQuote />
        Reviewing this project? Leave feedback
      </Button>
      <FeedbackDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  );
};

export default LoginFeedback;
