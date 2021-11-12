import { dataHeadEmailTable } from "../../data/dataHeadEmailTable";
import { ContainerCampaigns } from "../../components/ContainerCampaigns";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";

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
        <Loader title="Campaigns Data List is loading..." />
      ) : campaignsData.status === "success" ? (
        <>
          {campaignsData.status === "success" && !campaignsData.data.length ? (
            <Error
              titleOne="There are not campaigns added yet."
              titleTwo="Please add a new subscriber."
            />
          ) : (
            <>
              <h1
                style={{
                  textAlign: "center",
                  margin: "100px 0 60px 0",
                  color: "#142F43",
                  letterSpacing: 2,
                  wordSpacing: 15,
                }}
              >
                Campaigns:
              </h1>
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
