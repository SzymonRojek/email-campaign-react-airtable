import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";

import { useFeedback } from "customHooks/queries";
import { Loader } from "components/DisplayMessage";
import { PageHeader } from "components/PageHeader";
import { StyledContainer } from "components/StyledContainer";
import FeedbackDialog from "components/feedback/FeedbackDialog";
import FeedbackQuote from "components/feedback/FeedbackQuote";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// what the people who reviewed the project think - approved in Airtable before it shows
const FeedbackPage = () => {
  const [isOpen, setIsOpen] = useState(false);
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
        description="What do the people who reviewed this project think?"
        actions={leaveFeedback}
      />

      {isLoading ? (
        <Loader title="Loading the feedback..." />
      ) : !feedback?.length ? (
        <Card className="items-center gap-4 px-6 py-16 text-center text-sm text-muted-foreground">
          {isError ? "The feedback could not be loaded." : "No feedback yet - be the first!"}
        </Card>
      ) : (
        <ul aria-label="Feedback" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {feedback.map((item) => (
            <li key={item.id} className="grid">
              <FeedbackQuote feedback={item} />
            </li>
          ))}
        </ul>
      )}

      <FeedbackDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </StyledContainer>
  );
};

export default FeedbackPage;
