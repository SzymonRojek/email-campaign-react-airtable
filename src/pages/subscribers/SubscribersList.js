import { Container } from "@material-ui/core";

import { ContainerSubscribers } from "../../components/ContainerSubscribers";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { StyledHeading } from "../../components/StyledHeading";
import { generalDataHeadTable } from "../../data/dataHeadTable";

const SubscribersList = (props) => {
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
        <Loader title="Subscribers" />
      ) : subscribersData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Probably there is no an access to the internet."
          titleThree="Contact with your internet provider."
        />
      ) : (
        <Container>
          {subscribersData.status === "success" &&
          !subscribersData.data.length ? (
            <Error
              titleOne="There are not subscribers added yet."
              titleTwo="Please add a new subscriber."
            />
          ) : (
            <>
              <StyledHeading label="Subscribers:" />

              <ContainerSubscribers
                subHeading="List:"
                dataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.data}
                setSelectedData={setSelectedData}
                handleSubscriberDetails={handleSubscriberDetails}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            </>
          )}

          {subscribersData.data.length > 1 ? (
            <ContainerSubscribers
              subHeading="Latest added Subscriber:"
              dataHeadTable={generalDataHeadTable}
              subscribersData={subscribersData.latestSubscriber}
              setSelectedData={setSelectedData}
              handleSubscriberDetails={handleSubscriberDetails}
              setContentPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ) : (
            ""
          )}
        </Container>
      )}
    </>
  );
};

export default SubscribersList;
