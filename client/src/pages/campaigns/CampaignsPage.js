import PropTypes from "prop-types";

import { dataHeadEmailTable } from "data/dataHeadTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { CampaignsList } from "components/CampaignsList";
import { Error, Loader } from "components/DisplayMessage";

const CampaignsPage = ({ campaignsData, editCampaign, removeCampaign }) => (
  <>
    {campaignsData.status === "loading" ? (
      <Loader title="Campaigns" />
    ) : campaignsData.status === "error" ? (
      <Error
        titleOne="ERROR MESSAGE"
        titleTwo={`${campaignsData.data?.error.message || "Check endpoints"}`}
        titleThree="Also, please check your internet connection."
      />
    ) : !campaignsData.data.length ? (
      <Error
        titleOne="MESSAGE"
        titleTwo="There are no Email Campaigns added yet"
        titleThree="Please add a New Email Campaign"
      />
    ) : (
      campaignsData.status === "success" && (
        <StyledContainer>
          <div style={{ marginBottom: 100 }}>
            <StyledHeading label="All Campaigns" />

            <CampaignsList
              subHeading="List"
              dataHeadEmailTable={dataHeadEmailTable}
              passedData={sortDataAlphabetically(campaignsData.data)}
              editCampaign={editCampaign}
              removeCampaign={removeCampaign}
            />
          </div>

          {campaignsData.data.length > 1 ? (
            <CampaignsList
              subHeading="Latest added Campaign"
              dataHeadEmailTable={dataHeadEmailTable}
              passedData={getLatestAddedItem(campaignsData.data)}
              editCampaign={editCampaign}
              removeCampaign={removeCampaign}
            />
          ) : (
            ""
          )}
        </StyledContainer>
      )
    )}
  </>
);

CampaignsPage.propTypes = {
  campaignsData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        createdTime: PropTypes.string,
        fields: PropTypes.shape({
          status: PropTypes.string,
          title: PropTypes.string,
          description: PropTypes.string,
        }),
      })
    ),
  }),
  editCampaign: PropTypes.func,
  removeCampaign: PropTypes.func,
};

export default CampaignsPage;
