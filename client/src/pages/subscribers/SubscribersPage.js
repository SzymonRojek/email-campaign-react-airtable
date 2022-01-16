import PropTypes from "prop-types";

import { generalDataHeadTable } from "data/dataHeadTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";
import { Loader, Error } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { SubscribersList } from "components/SubscribersList";

const SubscribersPage = (props) => {
  const {
    subscribersData,
    setSelectedData,
    handleSubscriberDetails,
    setOpenConfirmPopup,
    setContentPopup,
  } = props;

  sortDataAlphabetically(subscribersData.data);
  const latestAddedSubscriber = getLatestAddedItem(subscribersData.data);

  return (
    <>
      {subscribersData.status === "loading" ? (
        <Loader title="Subscribers" />
      ) : subscribersData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Check access to the data from airtable base."
          titleThree="Also, please check your internet connection."
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
            <div style={{ marginBottom: 100 }}>
              <StyledHeading label="All Subscribers" />

              <SubscribersList
                subHeading="List"
                dataHeadTable={generalDataHeadTable}
                passedData={subscribersData.data}
                setSelectedData={setSelectedData}
                handleSubscriberDetails={handleSubscriberDetails}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            </div>
          )}

          {subscribersData.data.length > 1 ? (
            <SubscribersList
              subHeading="Latest added Subscriber"
              dataHeadTable={generalDataHeadTable}
              passedData={latestAddedSubscriber}
              setSelectedData={setSelectedData}
              handleSubscriberDetails={handleSubscriberDetails}
              setContentPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ) : (
            ""
          )}
        </StyledContainer>
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
