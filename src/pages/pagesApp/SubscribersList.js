import { ContainerTableSubscribers } from "../../components/ContainerTableSubscribers";
import { generalDataHeadTable } from "../../data/dataHeadTable";

const SubscribersList = (props) => {
  const {
    subscribersData,
    setOpenConfirmPopup,
    handlePopup,
    setIdClickedSubscriber,
    latestAddedSubscriber,
  } = props;

  return (
    <>
      <ContainerTableSubscribers
        dataHeadTable={generalDataHeadTable}
        subscribersData={subscribersData}
        setOpenConfirmPopup={setOpenConfirmPopup}
        handlePopup={handlePopup}
        setIdClickedSubscriber={setIdClickedSubscriber}
      />

      <h2 style={{ textAlign: "center", marginBottom: -40, color: "#303f9f" }}>
        Latest added subscriber:
      </h2>

      <ContainerTableSubscribers
        dataHeadTable={generalDataHeadTable}
        subscribersData={latestAddedSubscriber}
        setOpenConfirmPopup={setOpenConfirmPopup}
        handlePopup={handlePopup}
        setIdClickedSubscriber={setIdClickedSubscriber}
      />
    </>
  );
};
export default SubscribersList;
