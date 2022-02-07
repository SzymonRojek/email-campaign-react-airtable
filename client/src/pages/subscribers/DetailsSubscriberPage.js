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

const DetailsSubscriberPage = () => {
  const { id } = useParams();
  const endpoint = `/subscribers`;

  const { itemData: subscriberData } = useFetchDetailsById(endpoint, id);

  if (subscriberData.data?.error) {
    return (
      <Error
        titleOne={`${subscriberData.data?.error.messageOne}`}
        titleTwo={`${subscriberData.data?.error.messageTwo}`}
      />
    );
  }

  return (
    <>
      {subscriberData && subscriberData.status === "loading" ? (
        <Loader title="Details" />
      ) : (
        subscriberData.status === "success" && (
          <>
            <StyledHeading label="Subscriber Details" />
            <StyledContainer>
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
          </>
        )
      )}
    </>
  );
};

export default DetailsSubscriberPage;
