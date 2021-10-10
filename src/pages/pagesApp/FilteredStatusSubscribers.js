import { FilterStatusSubscribers } from "../../components/FilterStatusSubscribers";
import { generalDataHeadTable } from "../../data/dataHeadTable";

const FilteredStatusSubscribers = (props) => {
  const {
    subscribersData,
    setOpenConfirmPopup,
    setIdClickedSubscriber,
    handlePopup,
  } = props;

  return (
    <>
      <FilterStatusSubscribers
        generalDataHeadTable={generalDataHeadTable}
        subscribersData={subscribersData}
        status="active"
        setOpenConfirmPopup={setOpenConfirmPopup}
        setIdClickedSubscriber={setIdClickedSubscriber}
        handlePopup={handlePopup}
      />

      <FilterStatusSubscribers
        generalDataHeadTable={generalDataHeadTable}
        subscribersData={subscribersData}
        status="pending"
        setOpenConfirmPopup={setOpenConfirmPopup}
        setIdClickedSubscriber={setIdClickedSubscriber}
        handlePopup={handlePopup}
      />

      <FilterStatusSubscribers
        generalDataHeadTable={generalDataHeadTable}
        subscribersData={subscribersData}
        status="blocked"
        setOpenConfirmPopup={setOpenConfirmPopup}
        setIdClickedSubscriber={setIdClickedSubscriber}
        handlePopup={handlePopup}
      />
    </>
  );
};

export default FilteredStatusSubscribers;
