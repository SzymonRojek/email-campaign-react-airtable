import PropTypes from "prop-types";

import { generalDataHeadTable } from "data/dataHeadTable";
import { Loader, Error } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { SubscriberStatus } from "components/SubscriberStatus";

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
        <StyledContainer>
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
        </StyledContainer>
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
