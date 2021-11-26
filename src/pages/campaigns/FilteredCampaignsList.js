import { Container } from "@material-ui/core";

import { FilterStatusCampaigns } from "../../components/FilterStatusCampaigns";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { StyledHeading } from "../../components/StyledHeading";
import { dataHeadEmailTable } from "../../data/dataHeadEmailTable";

const FilteredCampaignsList = (props) => {
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
            />
          ) : (
            <>
              <StyledHeading label="Campaigns Status:" />

              <FilterStatusCampaigns
                subHeading="Sent:"
                dataHeadEmailTable={dataHeadEmailTable}
                campaignsData={campaignsData.data}
                status="sent"
                setSelectedData={setSelectedData}
                handleEditDetailsCampaign={handleEditDetailsCampaign}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />

              <FilterStatusCampaigns
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

export default FilteredCampaignsList;
