import PropTypes from "prop-types";
import { useQuery } from "react-query";

import api from "api";
import { dataHeadEmailTable } from "data/dataHeadTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { CampaignsList } from "components/CampaignsList";
import { Loader } from "components/DisplayMessage";

const EmailsPage = ({ editCampaign }) => {
  const {
    data: campaigns,
    isLoading,
    isFetching,
  } = useQuery("campaigns", api.fetchItems, {
    meta: {
      myMessage: "Can not get campaigns list",
    },
  });

  if (isLoading || isFetching) {
    return <Loader title="Emails" />;
  }

  return (
    <StyledContainer>
      <StyledHeading label="all emails" />
      <StyledMainContent>
        <div style={{ marginBottom: 100 }}>
          {campaigns && !campaigns.length ? (
            "List of emails is empty - please add new email"
          ) : (
            <CampaignsList
              subHeading="list"
              dataHeadEmailTable={dataHeadEmailTable}
              passedData={sortDataAlphabetically(campaigns ? campaigns : [])}
              editCampaign={editCampaign}
            />
          )}
        </div>

        {campaigns && campaigns.length ? (
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

EmailsPage.propTypes = {
  editCampaign: PropTypes.func,
};

export default EmailsPage;
