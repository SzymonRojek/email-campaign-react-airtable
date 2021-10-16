import { FilterStatusSubscribers } from "../../components/FilterStatusSubscribers";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { generalDataHeadTable } from "../../data/dataHeadTable";

const FilteredStatusSubscribers = (props) => {
  const {
    subscribersData,
    setOpenConfirmPopup,
    setIdClickedItem,
    setContentPopup,
    handleSubscriberDetails,
  } = props;

  return (
    <>
      {subscribersData.status === "loading" ? (
        <Loader title="Subscribers Data List is loading..." />
      ) : subscribersData.status === "success" ? (
        <>
          {subscribersData.status === "success" &&
          !subscribersData.data.length ? (
            <Error
              titleOne="There are not subscribers added yet."
              titleTwo="Please add a new subscriber."
            />
          ) : (
            <>
              <FilterStatusSubscribers
                generalDataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.data}
                status="active"
                setIdClickedItem={setIdClickedItem}
                handleSubscriberDetails={handleSubscriberDetails}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
              <FilterStatusSubscribers
                generalDataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.data}
                status="pending"
                setIdClickedItem={setIdClickedItem}
                handleSubscriberDetails={handleSubscriberDetails}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
              <FilterStatusSubscribers
                generalDataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.data}
                status="blocked"
                setIdClickedItem={setIdClickedItem}
                handleSubscriberDetails={handleSubscriberDetails}
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
          titleThree="Contact with your support team."
        />
      )}
    </>
  );
};

export default FilteredStatusSubscribers;
