import { useParams } from "react-router-dom";

import useGetItem from "customHooks/useGetItem";
import { detailsDataHeadTableFirst } from "data/dataHeadTable";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { ContainerTable, HeadTable } from "components/Table";
import { Loader } from "components/DisplayMessage";
import SubscribersList from "components/SubscribersList/SubscribersList";
import { SubscriberDetailsData } from "components/SubscriberTableRow/SubscriberDetailsData";
import { BodyTable } from "components/Table";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";
import { detailsDataHeadTableSecond } from "data/dataHeadTable";
import api from "api";

import { useInformationModalState } from "contexts/InformationModalContext";

const styles = {
  container: {
    marginTop: 100,
  },
};

const DetailsSubscriberPage = () => {
  const { id } = useParams();

  // const getItemById = async (key, id) => {
  //   const data = await api.get(`/subscriber/${id}`);

  //   return data;
  // };

  const {
    data: subscriber,
    isLoading,
    isError,
  } = useGetItem("/subscribers", id);

  const { setInformationModalState, setInformationModalText } =
    useInformationModalState();

  const informationModalProps = {
    colorButton: "error",
    onClose: () => {
      setInformationModalState({ isOpenInformationModal: false });
    },
  };

  const setErrorModal = () => {
    setInformationModalText({
      title: "ERROR",
      additionalText: "Check your internet connection",
      message: "Subscriber does not exist",
    });
    setInformationModalState({
      informationModalProps,
      isOpenInformationModal: true,
    });
  };

  if (isLoading) {
    <Loader title="Details" />;
  }

  // const {
  //   data: subscriber,
  //   isLoading,
  //   isError,
  // } = useQuery(["subscribers", id], () => getItemById("subscribers", id));

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
                  {[subscriber].map((subscriber, index) => (
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
  );
};

export default DetailsSubscriberPage;
