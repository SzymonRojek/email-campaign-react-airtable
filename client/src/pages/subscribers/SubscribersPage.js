import PropTypes from "prop-types";
import { useQuery } from "react-query";

import api from "api";
import { generalDataHeadTable } from "data/dataHeadTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";
import { Loader, Error } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { SubscribersList } from "components/SubscribersList";

const styles = {
  container: {
    marginBottom: 100,
  },
};

const SubscribersPage = ({ editSubscriber, handleSubscriberDetails }) => {
  const endpoint = "/subscribers";
  const {
    data: subscribers,
    isLoading,
    isFetching,
  } = useQuery(endpoint, api.fetchItems, {
    meta: {
      myMessage: "Cannot get subscribers list.",
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
          {!subscribers.length ? (
            <Error error="List of subscribers is empty - please add a new subscriber" />
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
