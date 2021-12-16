import PropTypes from "prop-types";
import { Container } from "@material-ui/core";

import { SubscribersList } from "components/SubscribersList";
import { Loader, Error } from "components/DisplayMessage";
import { StyledHeading } from "components/StyledHeading";
import { generalDataHeadTable } from "data/dataHeadTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";

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
              <StyledHeading label="Subscribers:" />

              <SubscribersList
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
            <SubscribersList
              subHeading="Latest added Subscriber:"
              dataHeadTable={generalDataHeadTable}
              subscribersData={latestAddedSubscriber}
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

SubscribersPage.propTypes = {
  subscribersData: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object),
    latestAddedItem: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  setSelectedData: PropTypes.func.isRequired,
  handleSubscriberDetails: PropTypes.func.isRequired,
  setOpenInfoPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default SubscribersPage;
