import PropTypes from "prop-types";
import { useQuery } from "react-query";

import { fetchData } from "services";
import { generalDataHeadTable } from "data/dataHeadTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";
import { Loader } from "components/DisplayMessage";
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
    status,
    isLoading,
    isFetching,
  } = useQuery(endpoint, fetchData, {
    meta: {
      myMessage: "Cannot get subscribers list.",
    },
  });

  if (isLoading | isFetching) {
    return <Loader title="loading" />;
  }

  return (
    <>
      <StyledContainer>
        <StyledHeading label="all subscribers" />
        <StyledMainContent>
          {status === "success" && (
            <div style={styles.container}>
              <SubscribersList
                subHeading="list"
                dataHeadTable={generalDataHeadTable}
                passedData={sortDataAlphabetically(subscribers || [])}
                editSubscriber={editSubscriber}
                handleSubscriberDetails={handleSubscriberDetails}
              />
            </div>
          )}

          {status === "success" && subscribers.length ? (
            <SubscribersList
              subHeading="latest added"
              dataHeadTable={generalDataHeadTable}
              passedData={getLatestAddedItem(subscribers || [])}
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
