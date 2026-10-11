import { useState } from "react";
import { Plus, Upload } from "lucide-react";

import { pluralize } from "helpers";
import { useSubscribers } from "customHooks/queries";
import { useSubscriberPanel } from "customHooks/useSubscriberPanel";
import { Error, Loader } from "components/DisplayMessage";
import { PageHeader } from "components/PageHeader";
import { StyledContainer } from "components/StyledContainer";
import ImportSubscribersDialog from "components/subscribers/ImportSubscribersDialog";
import SubscriberDetailsPanel from "components/subscribers/SubscriberDetailsPanel";
import SubscribersTable from "components/subscribers/SubscribersTable";
import { Button } from "@/components/ui/button";

const SubscribersPage = () => {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const panel = useSubscriberPanel();
  const { data: subscribers, isLoading, isError, refetch, isFetching } = useSubscribers(
    "Cannot get the candidates list."
  );

  if (isLoading) return <Loader />;
  if (isError || !subscribers)
    return (
      <Error
        error="Cannot load the candidates - please try again later."
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );

  const active = subscribers.filter(({ fields }) => fields.status === "active");

  return (
    <StyledContainer>
      <PageHeader
        title="Candidates"
        description={`${pluralize(subscribers.length, "candidate")} · ${active.length} open to offers`}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <Upload />
              Import CSV
            </Button>
            <Button variant="brand" onClick={panel.create}>
              <Plus />
              Add candidate
            </Button>
          </>
        }
      />
      <ImportSubscribersDialog isOpen={isImportOpen} onOpenChange={setIsImportOpen} />
      <SubscriberDetailsPanel />
      <SubscribersTable
        subscribers={subscribers}
        emptyMessage="There are no candidates yet - add the first one."
      />
    </StyledContainer>
  );
};

export default SubscribersPage;
