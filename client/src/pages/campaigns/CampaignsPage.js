import PropTypes from "prop-types";

import { dataHeadEmailTable } from "data/dataHeadTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { CampaignsList } from "../../components/CampaignsList";
import { Error, Loader } from "../../components/DisplayMessage";

const CampaignsPage = ({
  campaignsData,
  setSelectedData,
  handleEditDetailsCampaign,
  setOpenConfirmPopup,
  setContentPopup,
}) => {
  sortDataAlphabetically(campaignsData.data);

  const latestAddedCampaign = getLatestAddedItem(campaignsData.data);

  return (
    <>
      {campaignsData.status === "loading" ? (
        <Loader title="Campaigns" />
      ) : campaignsData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Check access to the data from airtable base."
          titleThree="Also, please check your internet connection."
        />
      ) : (
        <StyledContainer>
          {campaignsData.status === "success" && !campaignsData.data.length ? (
            <Error
              titleOne="There are not campaigns added yet."
              titleTwo="Please add a new campaign."
              titleThree="🙂"
            />
          ) : (
            <div style={{ marginBottom: 100 }}>
              <StyledHeading label="All Campaigns" />

              <CampaignsList
                subHeading="List"
                dataHeadEmailTable={dataHeadEmailTable}
                passedData={campaignsData.data}
                setSelectedData={setSelectedData}
                handleEditDetailsCampaign={handleEditDetailsCampaign}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            </div>
          )}

          {campaignsData.data.length > 1 ? (
            <CampaignsList
              subHeading="Latest added Campaign"
              dataHeadEmailTable={dataHeadEmailTable}
              passedData={latestAddedCampaign}
              handleEditDetailsCampaign={handleEditDetailsCampaign}
              setSelectedData={setSelectedData}
              setContentPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ) : (
            ""
          )}
        </StyledContainer>
      )}
    </>
  );
};

CampaignsPage.propTypes = {
  campaignsData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  setSelectedData: PropTypes.func.isRequired,
  handleEditDetailsCampaign: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default CampaignsPage;
