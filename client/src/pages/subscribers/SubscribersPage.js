import PropTypes from "prop-types";

import { generalDataHeadTable } from "data/dataHeadTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";
import { Loader, Error } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { SubscribersList } from "components/SubscribersList";

const styles = {
  container: {
    marginBottom: 100,
  },
};

const SubscribersPage = (props) => {
  const {
    subscribersData,
    handleSubscriberDetails,
    removeSubscriber,
    setOpenConfirmPopup,
    setContentPopup,
  } = props;

  return (
    <>
      {subscribersData.status === "loading" ? (
        <Loader title="Subscribers" />
      ) : subscribersData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo={`${
            subscribersData.data?.error.message || "Check endpoints"
          }`}
          titleThree="Also, please check your internet connection."
        />
      ) : !subscribersData.data.length ? (
        <Error
          titleOne="MESSAGE"
          titleTwo="There are no Subscribers added yet"
          titleThree="Please add a New Subscriber"
        />
      ) : (
        subscribersData.status === "success" && (
          <StyledContainer>
            <div style={styles.container}>
              <StyledHeading label="All Subscribers" />

              <SubscribersList
                subHeading="List"
                dataHeadTable={generalDataHeadTable}
                passedData={sortDataAlphabetically(subscribersData.data)}
                handleSubscriberDetails={handleSubscriberDetails}
                removeSubscriber={removeSubscriber}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            </div>

            {subscribersData.data && subscribersData.data.length > 1 ? (
              <SubscribersList
                subHeading="Latest added Subscriber"
                dataHeadTable={generalDataHeadTable}
                passedData={getLatestAddedItem(subscribersData.data)}
                handleSubscriberDetails={handleSubscriberDetails}
                removeSubscriber={removeSubscriber}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            ) : (
              ""
            )}
          </StyledContainer>
        )
      )}
    </>
  );
};

SubscribersPage.propTypes = {
  subscribersData: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object),
    latestAddedItem: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  setSelectedData: PropTypes.func.isRequired,
  handleSubscriberDetails: PropTypes.func,
  setOpenInfoPopup: PropTypes.func,
  setContentPopup: PropTypes.func,
};

export default SubscribersPage;
