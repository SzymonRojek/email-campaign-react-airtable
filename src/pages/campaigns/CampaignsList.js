import { Container } from "@material-ui/core";

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
    <Container>
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
                  marginBottom: -40,
                  color: "#003049",
                  letterSpacing: 2,
                }}
              >
                Campaigns List:
              </h1>
              <ContainerCampaigns
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
            <>
              <h2
                style={{
                  textAlign: "center",
                  marginBottom: -40,
                  color: "#003049",
                }}
              >
                Latest added Campaign:
              </h2>
              <ContainerCampaigns
                dataHeadEmailTable={dataHeadEmailTable}
                campaignsData={campaignsData.latestCampaign}
                setSelectedData={setSelectedData}
                handleEditCampaign={handleEditCampaign}
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
    </Container>
  );
};

export default CampaignsList;