import { useState } from "react";
import { Link } from "react-router";
import { Plus, Upload } from "lucide-react";

import { pluralize } from "helpers";
import { useSubscribers } from "customHooks/queries";
import { Error, Loader } from "components/DisplayMessage";
import { PageHeader } from "components/PageHeader";
import { StyledContainer } from "components/StyledContainer";
import ImportSubscribersDialog from "components/subscribers/ImportSubscribersDialog";
import SubscriberDetailsPanel from "components/subscribers/SubscriberDetailsPanel";
import SubscribersTable from "components/subscribers/SubscribersTable";
import { Button } from "@/components/ui/button";

const SubscribersPage = () => {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const { data: subscribers, isLoading, isError } = useSubscribers(
    "Cannot get subscribers list."
  );

  if (isLoading) return <Loader />;
  if (isError || !subscribers)
    return <Error error="Cannot load the subscribers - please try again later." />;

  const active = subscribers.filter(({ fields }) => fields.status === "active");

  return (
    <StyledContainer>
      <PageHeader
        title="Subscribers"
        description={`${pluralize(subscribers.length, "subscriber")} · ${active.length} active`}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <Upload />
              Import CSV
            </Button>
            <Button asChild variant="brand">
              <Link to="/subscribers/add">
                <Plus />
                Add subscriber
              </Link>
            </Button>
          </>
        }
      />
      <ImportSubscribersDialog isOpen={isImportOpen} onOpenChange={setIsImportOpen} />
      <SubscriberDetailsPanel />
      <SubscribersTable
        subscribers={subscribers}
        emptyMessage="There are no subscribers yet - add the first one."
      />
    </StyledContainer>
  );
};

export default SubscribersPage;
