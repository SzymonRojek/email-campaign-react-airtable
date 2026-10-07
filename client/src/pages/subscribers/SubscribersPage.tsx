import { Link } from "react-router";
import { Plus } from "lucide-react";

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
      <SubscribersTable
        title="List"
        subscribers={subscribers}
        action={
          <Button asChild variant="brand" size="sm">
            <Link to="/subscribers/add">
              <Plus />
              Add subscriber
            </Link>
          </Button>
        }
        emptyMessage="There are no subscribers yet - add the first one."
      />
    </StyledContainer>
  );
};

export default SubscribersPage;
