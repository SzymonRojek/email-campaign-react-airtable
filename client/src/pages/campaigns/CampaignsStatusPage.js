import PropTypes from "prop-types";
import { Container } from "@material-ui/core";

import { CampaignStatus } from "components/CampaignStatus";
import { Loader, Error } from "components/DisplayMessage";
import { StyledHeading } from "components/StyledHeading";
import { dataHeadEmailTable } from "data/dataHeadEmailTable";

const CampaignsStatusPage = (props) => {
  const {
    campaignsData,
    handleEditDetailsCampaign,
    setOpenConfirmPopup,
    setSelectedData,
    setContentPopup,
  } = props;

  return (
    <>
      {campaignsData.status === "loading" ? (
        <Loader title="Campaigns" />
      ) : campaignsData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Probably there is no an access to the internet."
          titleThree="Contact with your internet provider."
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
              <StyledHeading label="Campaigns Status:" />

              <CampaignStatus
                subHeading="Sent:"
                dataHeadEmailTable={dataHeadEmailTable}
                campaignsData={campaignsData.data}
                status="sent"
                setSelectedData={setSelectedData}
                handleEditDetailsCampaign={handleEditDetailsCampaign}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />

              <CampaignStatus
                subHeading="Draft:"
                dataHeadEmailTable={dataHeadEmailTable}
                campaignsData={campaignsData.data}
                status="draft"
                setSelectedData={setSelectedData}
                handleEditDetailsCampaign={handleEditDetailsCampaign}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            </>
          )}
        </Container>
      )}
    </>
  );
};

CampaignsStatusPage.propTypes = {
  campaignsData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
    latestAddedItem: PropTypes.arrayOf(PropTypes.object),
  }),
  handleEditDetailsCampaign: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default CampaignsStatusPage;