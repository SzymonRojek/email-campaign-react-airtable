import PropTypes from "prop-types";
import { useQuery } from "react-query";

import { fetchData } from "services";
import { dataHeadEmailTable } from "data/dataHeadTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { CampaignsList } from "components/CampaignsList";
import { Loader } from "components/DisplayMessage";

const EmailsPage = ({ editCampaign }) => {
  const endpoint = "/campaigns";
  const {
    data: campaigns,
    status,
    isLoading,
    isFetching,
  } = useQuery(endpoint, fetchData, {
    meta: {
      myMessage: "Can not get campaigns list",
    },
  });

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
              passedData={sortDataAlphabetically(campaigns || [])}
              editCampaign={editCampaign}
            />
          )}
        </div>

        {status === "success" && campaigns.length ? (
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
