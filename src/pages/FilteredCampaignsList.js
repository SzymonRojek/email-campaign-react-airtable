import { FilterStatusCampaigns } from "../components/FilterStatusCampaigns";
import { Loader } from "../components/Loader";
import { Error } from "../components/Error";
import { dataHeadEmailTable } from "../data/dataHeadEmailTable";

const FilteredCampaignsList = (props) => {
  const {
    campaignsData,
    handleDraftCampaign,
    setOpenConfirmPopup,
    setIdClickedItem,
    setContentPopup,
  } = props;

  return (
    <>
      {campaignsData.status === "loading" ? (
        <Loader title="Subscribers Data List is loading..." />
      ) : campaignsData.status === "success" ? (
        <>
          {campaignsData.status === "success" && !campaignsData.data.length ? (
            <Error
              titleOne="There are not campaigns added yet."
              titleTwo="Please add a new campaign."
            />
          ) : (
            <>
              <FilterStatusCampaigns
                dataHeadEmailTable={dataHeadEmailTable}
                campaignsData={campaignsData.data}
                status="sent"
                setIdClickedItem={setIdClickedItem}
                handleDraftCampaign={handleDraftCampaign}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />

              <FilterStatusCampaigns
                dataHeadEmailTable={dataHeadEmailTable}
                campaignsData={campaignsData.data}
                status="draft"
                setIdClickedItem={setIdClickedItem}
                handleDraftCampaign={handleDraftCampaign}
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
