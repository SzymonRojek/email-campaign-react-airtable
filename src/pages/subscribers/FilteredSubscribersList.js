import { Container } from "@material-ui/core";

import { FilterStatusSubscribers } from "../../components/FilterStatusSubscribers";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
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
    <Container>
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
                heading="Active Status:"
                generalDataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.data}
                status="active"
                setSelectedData={setSelectedData}
                handleSubscriberDetails={handleSubscriberDetails}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />

              <FilterStatusSubscribers
                heading="Pending Status:"
                generalDataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.data}
                status="pending"
                setSelectedData={setSelectedData}
                handleSubscriberDetails={handleSubscriberDetails}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />

              <FilterStatusSubscribers
                heading="Blocked Status:"
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
    </Container>
  );
};

export default FilteredSubscribersList;
