import { ContainerTableSubscribers } from "../../components/ContainerTableSubscribers";
import { Loader } from "../../components/Loader";
import { generalDataHeadTable } from "../../data/dataHeadTable";

const SubscribersList = (props) => {
  const {
    subscribersData,
    setOpenConfirmPopup,
    handlePopup,
    setIdClickedSubscriber,
  } = props;
  console.log(subscribersData);
  return (
    <>
      {subscribersData.status === "loading" ? (
        <Loader title="Subscribers Data are loading..." />
      ) : (
        <>
          <ContainerTableSubscribers
            dataHeadTable={generalDataHeadTable}
            subscribersData={subscribersData.data}
            setOpenConfirmPopup={setOpenConfirmPopup}
            handlePopup={handlePopup}
            setIdClickedSubscriber={setIdClickedSubscriber}
          />
          <h2
            style={{ textAlign: "center", marginBottom: -40, color: "#303f9f" }}
          >
            Latest added subscriber:
          </h2>
          <ContainerTableSubscribers
            dataHeadTable={generalDataHeadTable}
            subscribersData={subscribersData.latestSubscriber}
            setOpenConfirmPopup={setOpenConfirmPopup}
            handlePopup={handlePopup}
            setIdClickedSubscriber={setIdClickedSubscriber}
          />
        </>
      )}
    </>
  );
};
export default SubscribersList;
