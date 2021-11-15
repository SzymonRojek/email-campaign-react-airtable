import { FilterStatusSubscribers } from "../../components/FilterStatusSubscribers";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { StyledHeading } from "../../components/StyledHeading";
import { generalDataHeadTable } from "../../data/dataHeadTable";

const FilteredSubscribersList = (props) => {
  const {
    subscribersData,
    setOpenConfirmPopup,
    setSelectedData,
    setContentPopup,
    handleSubscriberDetails,
  } = props;

  return (
    <>
      {subscribersData.status === "loading" ? (
        <Loader title="Subscribers Data are loading..." />
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
              <StyledHeading label="Subscribers status:" />

              <FilterStatusSubscribers
                subHeading="Active:"
                generalDataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.data}
                status="active"
                setSelectedData={setSelectedData}
                handleSubscriberDetails={handleSubscriberDetails}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />

              <FilterStatusSubscribers
                subHeading="Pending:"
                generalDataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.data}
                status="pending"
                setSelectedData={setSelectedData}
                handleSubscriberDetails={handleSubscriberDetails}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />

              <FilterStatusSubscribers
                subHeading="Blocked:"
                generalDataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.data}
                status="blocked"
                setSelectedData={setSelectedData}
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

export default FilteredSubscribersList;
