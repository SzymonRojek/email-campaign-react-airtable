import PropTypes from "prop-types";

import { generalDataHeadTable } from "data/dataHeadTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";
import { Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { SubscribersList } from "components/SubscribersList";

import useGetItems from "customHooks/useGetItems";
import api from "api";
import { useQuery, useQueryClient } from "react-query";

const styles = {
  container: {
    marginBottom: 100,
  },
};

const getItems = async () => {
  const response = await api.get("/subscribers");

  // if (response.statusText !== "OK")
  //   throw new Error("There is no internet connection");
  return response;
};

const SubscribersPage = ({
  editSubscriber,
  handleSubscriberDetails,
  removeSubscriber,
}) => {
  // const { data: subscribers, isLoading, isError } = useGetItems("/subscribers");
  // const queryClient = useQueryClient();
  const {
    data: subscribers,
    isLoading,
    isFetching,
    isPaused,
    refetch,
    error,
  } = useQuery("subscribers", getItems);

  // {
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: false,
  //   // retry: 1,
  //   // retryDelay: 3000,
  // }
  if (isLoading) {
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
                removeSubscriber={removeSubscriber}
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
              removeSubscriber={removeSubscriber}
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
