import PropTypes from "prop-types";

import { dataHeadEmailTable } from "data/dataHeadEmailTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";
import { Loader, Error } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { CampaignsList } from "components/CampaignsList";

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
        <StyledContainer
          style={{
            // padding: "10px 50px",
            marginTop: 40,
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(5px)",
            borderRadius: 6,
          }}
        >
          {campaignsData.status === "success" && !campaignsData.data.length ? (
            <Error
              titleOne="There are not campaigns added yet."
              titleTwo="Please add a new campaign."
              titleThree="🙂"
            />
          ) : (
            <>
              <StyledHeading label="Campaigns:" />

              <CampaignsList
                subHeading="List:"
                dataHeadEmailTable={dataHeadEmailTable}
                campaignsData={campaignsData.data}
                setSelectedData={setSelectedData}
                handleEditDetailsCampaign={handleEditDetailsCampaign}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            </>
          )}

          {campaignsData.data.length > 1 ? (
            <CampaignsList
              subHeading="Latest added Campaign:"
              dataHeadEmailTable={dataHeadEmailTable}
              campaignsData={latestAddedCampaign}
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
