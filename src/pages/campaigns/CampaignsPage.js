import PropTypes from "prop-types";
import { Container } from "@material-ui/core";

import { dataHeadEmailTable } from "data/dataHeadEmailTable";
import { CampaignsList } from "components/CampaignsList";
import { Loader, Error } from "components/DisplayMessage";
import { StyledHeading } from "components/StyledHeading";

const CampaignsPage = ({
  campaignsData,
  setSelectedData,
  handleEditDetailsCampaign,
  setOpenConfirmPopup,
  setContentPopup,
}) => {
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
        <Container>
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
              campaignsData={campaignsData.latestAddedItem}
              handleEditDetailsCampaign={handleEditDetailsCampaign}
              setSelectedData={setSelectedData}
              setContentPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ) : (
            ""
          )}
        </Container>
      )}
    </>
  );
};

CampaignsPage.propTypes = {
  campaignsData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
    latestAddedItem: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  setSelectedData: PropTypes.func.isRequired,
  handleEditDetailsCampaign: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default CampaignsPage;
