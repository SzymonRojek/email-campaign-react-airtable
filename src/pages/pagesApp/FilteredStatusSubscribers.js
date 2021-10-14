import { FilterStatusSubscribers } from "../../components/FilterStatusSubscribers";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
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
      {subscribersData.status === "loading" ? (
        <Loader title="Data are filtering by status" />
      ) : subscribersData.status === "success" ? (
        <>
          <FilterStatusSubscribers
            generalDataHeadTable={generalDataHeadTable}
            subscribersData={subscribersData.data}
            status="active"
            setOpenConfirmPopup={setOpenConfirmPopup}
            setIdClickedSubscriber={setIdClickedSubscriber}
            handlePopup={handlePopup}
          />

          <FilterStatusSubscribers
            generalDataHeadTable={generalDataHeadTable}
            subscribersData={subscribersData.data}
            status="pending"
            setOpenConfirmPopup={setOpenConfirmPopup}
            setIdClickedSubscriber={setIdClickedSubscriber}
            handlePopup={handlePopup}
          />

          <FilterStatusSubscribers
            generalDataHeadTable={generalDataHeadTable}
            subscribersData={subscribersData.data}
            status="blocked"
            setOpenConfirmPopup={setOpenConfirmPopup}
            setIdClickedSubscriber={setIdClickedSubscriber}
            handlePopup={handlePopup}
          />
        </>
      ) : (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Probably you have got internet connection problem."
          titleThree="Contact with your support team."
        />
      )}
    </>
  );
};

export default FilteredStatusSubscribers;
