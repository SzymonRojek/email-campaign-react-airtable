import PropTypes from "prop-types";

import { generalDataHeadTable } from "data/dataHeadTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";
import { Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { SubscribersList } from "components/SubscribersList";
import { useQuery } from "react-query";
import api from "api";

const styles = {
  container: {
    marginBottom: 100,
  },
};

const SubscribersPage = ({ editSubscriber, handleSubscriberDetails }) => {
  const {
    data: subscribers,
    isLoading,
    isFetching,
  } = useQuery("subscribers", api.fetchItems, {
    meta: {
      myMessage: "Cannot get subscribers list:",
    },
  });

  if (isLoading | isFetching) {
    return <Loader title="Subscribers" />;
  }

  return (
    <>
      <StyledContainer>
        <StyledHeading label="all subscribers" />
        <StyledMainContent>
          {subscribers && !subscribers.length ? (
            "List of subscribers is empty - please add a subscriber"
          ) : (
            <div style={styles.container}>
              <SubscribersList
                subHeading="list"
                dataHeadTable={generalDataHeadTable}
                passedData={sortDataAlphabetically(
                  subscribers ? subscribers : []
                )}
                editSubscriber={editSubscriber}
                handleSubscriberDetails={handleSubscriberDetails}
              />
            </div>
          )}

          {subscribers && subscribers.length ? (
            <SubscribersList
              subHeading="latest added"
              dataHeadTable={generalDataHeadTable}
              passedData={getLatestAddedItem(subscribers)}
              editSubscriber={editSubscriber}
              handleSubscriberDetails={handleSubscriberDetails}
            />
          ) : (
            ""
          )}
        </StyledMainContent>
      </StyledContainer>
    </>
  );
};

SubscribersPage.propTypes = {
  editSubscriber: PropTypes.func,
  handleSubscriberDetails: PropTypes.func,
};

export default SubscribersPage;
