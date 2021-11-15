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
        <Loader title="Campaigns Data are loading" />
      ) : campaignsData.status === "success" ? (
        <>
          {campaignsData.status === "success" && !campaignsData.data.length ? (
            <Error
              titleOne="There are not campaigns added yet."
              titleTwo="Please add a new subscriber."
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
              campaignsData={campaignsData.latestCampaign}
              setSelectedData={setSelectedData}
              handleEditCampaign={handleEditCampaign}
              setContentPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ) : (
            ""
          )}
        </>
      ) : (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Probably there is no an access to the internet."
          titleThree="Contact with your internet provider."
        />
      )}
    </>
  );
};

export default CampaignsList;
