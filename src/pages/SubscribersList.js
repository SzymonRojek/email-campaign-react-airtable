import { ContainerSubscribers } from "../components/ContainerSubscribers";
import { Loader } from "../components/Loader";
import { Error } from "../components/Error";
import { generalDataHeadTable } from "../data/dataHeadTable";

const SubscribersList = (props) => {
  const {
    subscribersData,
    setOpenConfirmPopup,
    setSelectedData,
    setContentPopup,
    handleSubscriberDetails,
  } = props;

  return (
    <div style={{ margin: 20 }}>
      {subscribersData.status === "loading" ? (
        <Loader title="Subscribers Data List is loading..." />
      ) : subscribersData.status === "success" ? (
        <>
          {subscribersData.status === "success" &&
          !subscribersData.data.length ? (
            <Error
              titleOne="There are not subscribers added yet."
              titleTwo="Please add a new subscriber."
            />
          ) : (
            <ContainerSubscribers
              dataHeadTable={generalDataHeadTable}
              subscribersData={subscribersData.data}
              setSelectedData={setSelectedData}
              handleSubscriberDetails={handleSubscriberDetails}
              setContentPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          )}

          {subscribersData.data.length > 1 ? (
            <>
              <h2
                style={{
                  textAlign: "center",
                  marginBottom: -40,
                  color: "#303f9f",
                }}
              >
                Latest added subscriber:
              </h2>
              <ContainerSubscribers
                dataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.latestSubscriber}
                setSelectedData={setSelectedData}
                handleSubscriberDetails={handleSubscriberDetails}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            </>
          ) : (
            ""
          )}
        </>
      ) : (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Probably there is no an access to the internet."
          titleThree="Contact with your internet provider."
        />
      )}
    </div>
  );
};

export default SubscribersList;
