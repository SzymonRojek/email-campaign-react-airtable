import PropTypes from "prop-types";

import { generalDataHeadTable } from "data/dataHeadTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";
import { Loader, Error } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { SubscribersList } from "components/SubscribersList";
import { useAPI } from "APiContextProvider";

const styles = {
  container: {
    marginBottom: 100,
  },
};

const SubscribersPage = ({
  editSubscriber,
  handleSubscriberDetails,
  removeSubscriber,
}) => {
  const { subscribersData } = useAPI();

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
            <StyledHeading label="all subscribers" />
            <StyledMainContent>
              <div style={styles.container}>
                <SubscribersList
                  subHeading="list"
                  dataHeadTable={generalDataHeadTable}
                  passedData={sortDataAlphabetically(subscribersData.data)}
                  editSubscriber={editSubscriber}
                  handleSubscriberDetails={handleSubscriberDetails}
                  removeSubscriber={removeSubscriber}
                />
              </div>

              {subscribersData.data && subscribersData.data.length > 1 ? (
                <SubscribersList
                  subHeading="latest added"
                  dataHeadTable={generalDataHeadTable}
                  passedData={getLatestAddedItem(subscribersData.data)}
                  editSubscriber={editSubscriber}
                  handleSubscriberDetails={handleSubscriberDetails}
                  removeSubscriber={removeSubscriber}
                />
              ) : (
                ""
              )}
            </StyledMainContent>
          </StyledContainer>
        )
      )}
    </>
  );
};

SubscribersPage.propTypes = {
  subscribersData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        createdTime: PropTypes.string,
        fields: PropTypes.shape({
          status: PropTypes.string,
          name: PropTypes.string,
          surname: PropTypes.string,
          profession: PropTypes.string,
          email: PropTypes.string,
          salary: PropTypes.string,
          telephone: PropTypes.string,
        }),
      })
    ),
  }),
  editSubscriber: PropTypes.func,
  handleSubscriberDetails: PropTypes.func,
  removeSubscriber: PropTypes.func,
};

export default SubscribersPage;
