import PropTypes from "prop-types";
import { Container } from "@material-ui/core";

import { SubscriberStatus } from "components/SubscriberStatus";
import { Loader, Error } from "components/DisplayMessage";
import { StyledHeading } from "components/StyledHeading";
import { generalDataHeadTable } from "data/dataHeadTable";

const SubscribersStatusPage = (props) => {
  const {
    subscribersData,
    handleSubscriberDetails,
    setOpenConfirmPopup,
    setSelectedData,
    setContentPopup,
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
              titleThree="🙂"
            />
          ) : (
            <>
              <StyledHeading label="Subscribers status:" />

              <SubscriberStatus
                subHeading="Active:"
                generalDataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.data}
                status="active"
                setSelectedData={setSelectedData}
                handleSubscriberDetails={handleSubscriberDetails}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />

              <SubscriberStatus
                subHeading="Pending:"
                generalDataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.data}
                status="pending"
                setSelectedData={setSelectedData}
                handleSubscriberDetails={handleSubscriberDetails}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />

              <SubscriberStatus
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
        </Container>
      )}
    </>
  );
};

SubscribersStatusPage.propTypes = {
  subscribersData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
    latestAddedItem: PropTypes.arrayOf(PropTypes.object),
  }),
  handleSubscriberDetails: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default SubscribersStatusPage;
