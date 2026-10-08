import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";

import { pluralize } from "helpers";
import { useFeedback } from "customHooks/queries";
import { Loader } from "components/DisplayMessage";
import { PageHeader } from "components/PageHeader";
import { StyledContainer } from "components/StyledContainer";
import FeedbackDialog from "components/feedback/FeedbackDialog";
import FeedbackQuote from "components/feedback/FeedbackQuote";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// the first ones, then "Show more" - a long wall of cards is hard to read
const PAGE = 9;

// what the people who reviewed the project think - approved in Airtable before it shows
const FeedbackPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shownCount, setShownCount] = useState(PAGE);
  const { data: feedback, isLoading, isError } = useFeedback();

  const leaveFeedback = (
    <Button variant="brand" onClick={() => setIsOpen(true)}>
      <MessageSquarePlus />
      Leave feedback
    </Button>
  );

  return (
    <StyledContainer>
      <PageHeader
        title="Feedback"
        description={
          feedback?.length
            ? `What the people who reviewed this project think · ${pluralize(feedback.length, "review")}`
            : "What the people who reviewed this project think"
        }
        actions={leaveFeedback}
      />

      {isLoading ? (
        <Loader title="Loading the feedback..." />
      ) : !feedback?.length ? (
        <Card className="items-center gap-4 px-6 py-16 text-center text-sm text-muted-foreground">
          {isError ? "The feedback could not be loaded." : "No feedback yet - be the first!"}
        </Card>
      ) : (
        <>
          {/* columns of cards of their own height - short and long feedback both look good */}
          <ul aria-label="Feedback" className="gap-4 sm:columns-2 xl:columns-3">
            {feedback.slice(0, shownCount).map((item) => (
              <li key={item.id} className="mb-4 break-inside-avoid">
                <FeedbackQuote feedback={item} />
              </li>
            ))}
          </ul>
          {feedback.length > shownCount && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setShownCount((count) => count + PAGE)}>
                Show more
              </Button>
            </div>
          )}
        </>
      )}

      <FeedbackDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </StyledContainer>
  );
};

export default FeedbackPage;
