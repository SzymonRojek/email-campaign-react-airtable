import { FilterStatusCampaigns } from "../../components/FilterStatusCampaigns";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { StyledHeading } from "../../components/StyledHeading";
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
      {campaignsData.status === "loading" ? (
        <Loader title="Campaigns" />
      ) : campaignsData.status === "success" ? (
        <>
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
    </>
  );
};

export default FilteredCampaignsList;
