import { Container } from "@material-ui/core";

import { dataHeadEmailTable } from "../../data/dataHeadEmailTable";
import { ContainerCampaigns } from "../../components/ContainerCampaigns";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { StyledHeading } from "../../components/StyledHeading";

const CampaignsList = ({
  campaignsData,
  setSelectedData,
  handleEditCampaign,
  setContentPopup,
  setOpenConfirmPopup,
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
            />
          ) : (
            <>
              <StyledHeading label="Campaigns:" />

              <ContainerCampaigns
                subHeading="List:"
                dataHeadEmailTable={dataHeadEmailTable}
                campaignsData={campaignsData.data}
                setSelectedData={setSelectedData}
                handleEditCampaign={handleEditCampaign}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            </>
          )}

          {campaignsData.data.length > 1 ? (
            <ContainerCampaigns
              subHeading="Latest added Campaign:"
              dataHeadEmailTable={dataHeadEmailTable}
              campaignsData={campaignsData.latestAddedItem}
              setSelectedData={setSelectedData}
              handleEditCampaign={handleEditCampaign}
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

export default CampaignsList;
