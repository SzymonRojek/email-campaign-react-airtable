import { ContainerTableSubscribers } from "../../components/ContainerTableSubscribers";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { generalDataHeadTable } from "../../data/dataHeadTable";

const SubscribersList = (props) => {
  const {
    subscribersData,
    setOpenInfoPopup,
    setOpenConfirmPopup,
    setContentInfoPopup,
    handlePopup,
    setIdClickedSubscriber,
  } = props;

  return (
    <>
      {subscribersData.status === "loading" ? (
        <Loader title="Subscribers Data List is loading..." />
      ) : subscribersData.status === "success" ? (
        <>
          {subscribersData.status === "success" &&
          !subscribersData.data.length ? (
            <Error
              titleOne="There aren't subscribers added yet."
              titleTwo="Please add a new subscriber"
            />
          ) : (
            <ContainerTableSubscribers
              dataHeadTable={generalDataHeadTable}
              subscribersData={subscribersData.data}
              setOpenConfirmPopup={setOpenConfirmPopup}
              handlePopup={handlePopup}
              setIdClickedSubscriber={setIdClickedSubscriber}
            />
          )}
          {/* condition for details */}
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
              <ContainerTableSubscribers
                dataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.latestSubscriber}
                setOpenConfirmPopup={setOpenConfirmPopup}
                handlePopup={handlePopup}
                setIdClickedSubscriber={setIdClickedSubscriber}
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
          titleThree="Contact with your support team."
        />
      )}
    </>
  );
};

export default SubscribersList;

// subscribersData.data.length === 0 ? (
//   (setOpenInfoPopup(true),
//   setContentInfoPopup({
//     title: "",
//     text: "There are no subscribers added yet",
//     // colorButton: "error",
//   }))
