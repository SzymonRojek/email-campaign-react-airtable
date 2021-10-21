import { dataHeadEmailTable } from "../data/dataHeadEmailTable";
import { ContainerCampaigns } from "../components/ContainerCampaigns";
import { Loader } from "../components/Loader";
import { Error } from "../components/Error";

const EmailCampaignsList = ({
  campaignsData,
  setIdClickedItem,
  handleDraftCampaign,
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
            <ContainerCampaigns
              dataHeadEmailTable={dataHeadEmailTable}
              campaignsData={campaignsData.data}
              handleDraftCampaign={handleDraftCampaign}
              setIdClickedItem={setIdClickedItem}
              setContentPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          )}

          {campaignsData.data.length > 1 ? (
            <>
              <h2
                style={{
                  textAlign: "center",
                  marginBottom: -40,
                  color: "#303f9f",
                }}
              >
                Latest added campaign:
              </h2>
              <ContainerCampaigns
                dataHeadEmailTable={dataHeadEmailTable}
                campaignsData={campaignsData.latestCampaign}
                setIdClickedItem={setIdClickedItem}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            </>
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

export default EmailCampaignsList;
