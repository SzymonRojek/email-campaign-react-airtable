import { dataHeadEmailTable } from "data/dataHeadTable";
import { getLatestAddedItem } from "helpers";
import { useCampaigns } from "customHooks/queries";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { CampaignsList } from "components/CampaignsList";
import { Loader } from "components/DisplayMessage";
import { Campaign } from "types";

interface EmailsPageProps {
  editCampaign: (campaign: Campaign) => void;
}

const EmailsPage = ({ editCampaign }: EmailsPageProps) => {
  const {
    data: campaigns,
    status,
    isLoading,
    isFetching,
  } = useCampaigns("Can not get campaigns list");

  if (isLoading || isFetching) {
    return <Loader title="loading" />;
  }

  return (
    <StyledContainer>
      <StyledHeading label="all emails" />
      <StyledMainContent>
        <div style={{ marginBottom: 100 }}>
          {status === "success" && (
            <CampaignsList
              subHeading="list"
              dataHeadEmailTable={dataHeadEmailTable}
              passedData={campaigns || []}
              editCampaign={editCampaign}
            />
          )}
        </div>

        {campaigns && campaigns.length > 0 ? (
          <CampaignsList
            subHeading="latest added"
            dataHeadEmailTable={dataHeadEmailTable}
            passedData={getLatestAddedItem(campaigns)}
            editCampaign={editCampaign}
          />
        ) : (
          ""
        )}
      </StyledMainContent>
    </StyledContainer>
  );
};

export default EmailsPage;
