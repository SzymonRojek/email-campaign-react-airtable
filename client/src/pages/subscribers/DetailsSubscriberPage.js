import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

import api from "api";
import {
  detailsDataHeadTableFirst,
  detailsDataHeadTableSecond,
} from "data/dataHeadTable";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { ContainerTable, HeadTable } from "components/Table";
import { Loader, Error } from "components/DisplayMessage";
import { SubscribersList } from "components/SubscribersList";
import { SubscriberDetailsData } from "components/SubscriberTableRow/SubscriberDetailsData";
import { BodyTable } from "components/Table";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";

const styles = {
  container: {
    marginTop: 100,
  },
};

const DetailsSubscriberPage = () => {
  const endpoint = "/subscribers";
  const { id } = useParams();

  const {
    data: subscriber,
    isLoading,
    isFetching,
    isError,
  } = useQuery([endpoint, { id }], api.fetchDetailsItemById, {
    meta: {
      myMessage: "Subscriber does not exist! ",
    },
  });

  if (isLoading || isFetching) {
    return <Loader title="Details" />;
  }

  if (isError) {
    return <Error error="Subscriber does not exist!" />;
  }

  return (
    <StyledContainer>
      <StyledHeading label="Subscriber Details" />
      <StyledMainContent>
        <SubscribersList
          subHeading="general"
          dataHeadTable={detailsDataHeadTableFirst}
          passedData={[subscriber]}
        />
        <div style={styles.container}>
          <CustomPaginator
            passedData={[subscriber]}
            renderData={() => (
              <ContainerTable subHeading="details" passedData={[subscriber]}>
                <HeadTable dataHeadTable={detailsDataHeadTableSecond} />

                <BodyTable>
                  <SubscriberDetailsData subscriber={subscriber} />
                </BodyTable>
              </ContainerTable>
            )}
          />
        </div>
      </StyledMainContent>
    </StyledContainer>
  );
};

export default DetailsSubscriberPage;
