import { generalDataHeadTable } from "data/dataHeadTable";
import { getLatestAddedItem } from "helpers";
import { useSubscribers } from "customHooks/queries";
import { Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { SubscribersList } from "components/SubscribersList";
import { Subscriber } from "types";

const styles = {
  container: {
    marginBottom: 100,
  },
} as const;

interface SubscribersPageProps {
  editSubscriber: (subscriber: Subscriber) => void;
  handleSubscriberDetails: (subscriber: Subscriber) => void;
}

const SubscribersPage = ({
  editSubscriber,
  handleSubscriberDetails,
}: SubscribersPageProps) => {
  const {
    data: subscribers,
    status,
    isLoading,
    isFetching,
  } = useSubscribers("Cannot get subscribers list.");

  if (isLoading || isFetching) {
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
                passedData={subscribers || []}
                editSubscriber={editSubscriber}
                handleSubscriberDetails={handleSubscriberDetails}
              />
            </div>
          )}

          {subscribers && subscribers.length > 0 ? (
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

export default SubscribersPage;
