import { Container } from "@material-ui/core";

import { FilterStatusCampaigns } from "../../components/FilterStatusCampaigns";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { dataHeadEmailTable } from "../../data/dataHeadEmailTable";

const FilteredCampaignsList = (props) => {
  const {
    campaignsData,
    handleEditCampaign,
    setOpenConfirmPopup,
    setSelectedData,
    setContentPopup,
  } = props;

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          margin: "100px 0 60px 0",
          color: "#003049",
          letterSpacing: 2,
          wordSpacing: 15,
        }}
      >
        Campaigns status:
      </h1>
      <Container>
        {campaignsData.status === "loading" ? (
          <Loader title="Subscribers Data List is loading..." />
        ) : campaignsData.status === "success" ? (
          <>
            {campaignsData.status === "success" &&
            !campaignsData.data.length ? (
              <Error
                titleOne="There are not campaigns added yet."
                titleTwo="Please add a new campaign."
              />
            ) : (
              <>
                <FilterStatusCampaigns
                  subHeading="Sent:"
                  dataHeadEmailTable={dataHeadEmailTable}
                  campaignsData={campaignsData.data}
                  status="sent"
                  setSelectedData={setSelectedData}
                  handleEditCampaign={handleEditCampaign}
                  setContentPopup={setContentPopup}
                  setOpenConfirmPopup={setOpenConfirmPopup}
                />

                <FilterStatusCampaigns
                  subHeading="Draft:"
                  dataHeadEmailTable={dataHeadEmailTable}
                  campaignsData={campaignsData.data}
                  status="draft"
                  setSelectedData={setSelectedData}
                  handleEditCampaign={handleEditCampaign}
                  setContentPopup={setContentPopup}
                  setOpenConfirmPopup={setOpenConfirmPopup}
                />
              </>
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
    </>
  );
};

export default FilteredCampaignsList;
