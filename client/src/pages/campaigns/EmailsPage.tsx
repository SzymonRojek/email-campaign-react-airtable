import { Link } from "react-router";
import { Plus } from "lucide-react";

import { pluralize } from "helpers";
import { useCampaigns } from "customHooks/queries";
import { Error, Loader } from "components/DisplayMessage";
import { PageHeader } from "components/PageHeader";
import { StyledContainer } from "components/StyledContainer";
import CampaignsTable from "components/campaigns/CampaignsTable";
import { Button } from "@/components/ui/button";

const EmailsPage = () => {
  const { data: campaigns, isLoading, isError, refetch, isFetching } = useCampaigns(
    "Can not get campaigns list"
  );

  if (isLoading) return <Loader />;
  if (isError || !campaigns)
    return (
      <Error
        error="Cannot load the campaigns - please try again later."
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );

  const sent = campaigns.filter(({ fields }) => fields.status === "sent");

  return (
    <StyledContainer>
      <PageHeader
        title="Campaigns"
        description={`${pluralize(campaigns.length, "campaign")} · ${sent.length} sent · ${pluralize(campaigns.length - sent.length, "draft")}`}
        actions={
          <Button asChild variant="brand">
            <Link to="/campaigns/add">
              <Plus />
              New campaign
            </Link>
          </Button>
        }
      />
      <CampaignsTable
        campaigns={campaigns}
        emptyMessage="There are no campaigns yet - write the first one."
      />
    </StyledContainer>
  );
};

export default EmailsPage;
