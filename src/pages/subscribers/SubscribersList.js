import PropTypes from "prop-types";
import { Container } from "@material-ui/core";

import { ContainerSubscribers } from "../../components/ContainerSubscribers";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { StyledHeading } from "../../components/StyledHeading";
import { generalDataHeadTable } from "../../data/dataHeadTable";

const SubscribersList = (props) => {
  const {
    subscribersData,
    setSelectedData,
    handleSubscriberDetails,
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
              subscribersData={subscribersData.latestAddedItem}
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

SubscribersList.propTypes = {
  subscribersData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
    latestAddedItem: PropTypes.arrayOf(PropTypes.object),
  }),
  setSelectedData: PropTypes.func.isRequired,
  handleSubscriberDetails: PropTypes.func.isRequired,
  setOpenInfoPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default SubscribersList;
