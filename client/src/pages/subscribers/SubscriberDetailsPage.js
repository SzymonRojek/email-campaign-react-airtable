// import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

import { useFetchDetailsById } from "useFetchDetailsById";
import { detailsDataHeadTableFirst } from "data/dataHeadTable";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { ContainerTable, HeadTable } from "components/Table";
import { Loader, Error } from "components/DisplayMessage";
import SubscribersList from "components/SubscribersList/SubscribersList";
import { SubscriberDetailsData } from "components/SubscriberTableRow/SubscriberDetailsData";
import { BodyTable } from "components/Table";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";
import { detailsDataHeadTableSecond } from "data/dataHeadTable";

const styles = {
  container: {
    marginTop: 100,
  },
};

const SubscriberDetailsPage = ({ subscribersData }) => {
  const { id } = useParams();
  const endpoint = `/subscribers/${id}`;
  const { itemData: subscriberData } = useFetchDetailsById(endpoint);

  return (
    <>
      {subscriberData && subscriberData.status === "loading" ? (
        <Loader title="Details" />
      ) : !Boolean(
          subscribersData.data &&
            subscribersData.data.find((item) => item.id === id)
        ) ? (
        <Error
          titleOne="Unfortunately, this Subscriber does not exist"
          titleTwo="Check the url address"
          titleThree="Back to Subscribers List"
        />
      ) : (
        <StyledContainer>
          <StyledHeading label="Subscriber Details" />

          <SubscribersList
            subHeading="General data"
            dataHeadTable={detailsDataHeadTableFirst}
            passedData={[subscriberData.data]}
          />

          <div style={styles.container}>
            <CustomPaginator
              passedData={[subscriberData.data]}
              renderData={() => {
                return (
                  <ContainerTable
                    subHeading="Details data"
                    passedData={[subscriberData.data]}
                  >
                    <HeadTable dataHeadTable={detailsDataHeadTableSecond} />

                    <BodyTable>
                      {[subscriberData.data].map((subscriber, index) => (
                        <SubscriberDetailsData
                          key={`id-${subscriber.id}`}
                          subscriber={subscriber}
                          index={index}
                        />
                      ))}
                    </BodyTable>
                  </ContainerTable>
                );
              }}
            />
          </div>
        </StyledContainer>
      )}
    </>
  );
};

// SubscriberDetailsPage.propTypes = {
//   subscribersData: PropTypes.shape({
//     status: PropTypes.string,
//     data: PropTypes.arrayOf(PropTypes.object),
//   }),
// };

export default SubscriberDetailsPage;
