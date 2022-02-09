import { useParams } from "react-router-dom";

import { useFetchDetailsById } from "useFetchDetailsById";
import { detailsDataHeadTableFirst } from "data/dataHeadTable";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
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
          <StyledContainer>
            <StyledHeading label="Subscriber Details" />
            <StyledMainContent>
              <SubscribersList
                subHeading="general"
                dataHeadTable={detailsDataHeadTableFirst}
                passedData={[subscriberData.data]}
              />

              <div style={styles.container}>
                <CustomPaginator
                  passedData={[subscriberData.data]}
                  renderData={() => (
                    <ContainerTable
                      subHeading="details"
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
                  )}
                />
              </div>
            </StyledMainContent>
          </StyledContainer>
        )
      )}
    </>
  );
};

export default DetailsSubscriberPage;
