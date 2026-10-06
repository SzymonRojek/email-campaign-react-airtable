import { Link } from "react-router-dom";

import { getLatestAddedItem } from "helpers";
import { useSubscribers } from "customHooks/queries";
import { Error, Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import SubscribersTable from "components/subscribers/SubscribersTable";
import { Button } from "@/components/ui/button";

const SubscribersPage = () => {
  const { data: subscribers, isLoading, isError } = useSubscribers(
    "Cannot get subscribers list."
  );

  if (isLoading) return <Loader />;
  if (isError || !subscribers)
    return <Error error="Cannot load the subscribers - please try again later." />;

  return (
    <StyledContainer>
      <StyledHeading label="all subscribers" />
      <div className="grid gap-8">
        <SubscribersTable
          title="List"
          subscribers={subscribers}
          emptyMessage={
            <>
              <p>There are no subscribers yet.</p>
              <Button asChild variant="brand" className="mt-4">
                <Link to="/subscribers/add">Add subscriber</Link>
              </Button>
            </>
          }
        />
        {subscribers.length > 0 && (
          <SubscribersTable
            title="Latest added"
            subscribers={getLatestAddedItem(subscribers)}
          />
        )}
      </div>
    </StyledContainer>
  );
};

export default SubscribersPage;
