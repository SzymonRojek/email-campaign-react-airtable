import { Link } from "react-router";
import { Plus } from "lucide-react";

import { useCampaigns } from "customHooks/queries";
import { Error, Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import CampaignsTable from "components/campaigns/CampaignsTable";
import { Button } from "@/components/ui/button";

const EmailsPage = () => {
  const { data: campaigns, isLoading, isError } = useCampaigns(
    "Can not get campaigns list"
  );

  if (isLoading) return <Loader />;
  if (isError || !campaigns)
    return <Error error="Cannot load the campaigns - please try again later." />;

  return (
    <StyledContainer>
      <StyledHeading label="all emails" />
      <CampaignsTable
        title="List"
        campaigns={campaigns}
        action={
          <Button asChild variant="brand" size="sm">
            <Link to="/campaigns/add">
              <Plus />
              Add campaign
            </Link>
          </Button>
        }
        emptyMessage="There are no campaigns yet - add the first one."
      />
    </StyledContainer>
  );
};

export default EmailsPage;
