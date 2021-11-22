import { useState, useEffect, useRef } from "react";
import { Container } from "@material-ui/core";

import { ContainerSubscribers } from "../../components/ContainerSubscribers";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { StyledHeading } from "../../components/StyledHeading";
import { generalDataHeadTable } from "../../data/dataHeadTable";

const SubscribersList = (props) => {
  const {
    subscribersData,
    setOpenConfirmPopup,
    setSelectedData,
    setContentPopup,
    handleSubscriberDetails,
  } = props;

  const [dataLength, setDataLength] = useState(0);

  function useOnceCall(cb, condition = true) {
    const isCalledRef = useRef(false);

    useEffect(() => {
      if (condition && !isCalledRef.current) {
        isCalledRef.current = true;
        cb();
      }
    }, [cb, condition]);
  }
  // const refreshPage = () => {
  //   if (subscribersData.data) {
  //     setDataLength((prev) => prev !== subscribersData.data.length);
  //   }

  //   // if (!window.location.hash) {
  //   //   window.location = window.location + "#loaded";
  //   //   window.location.reload();
  //   // }
  //   if (window.location.href.substr(-2) !== "?r") {
  //     window.location = window.location.href + "?r";
  //   }
  // };
  function reloadPage() {
    if (window.location.href.substr(-2) !== "?r") {
      window.location = window.location.href + "?r";
    }
  }

  // useEffect(() => {
  //   refreshPage();
  // }, [dataLength]);

  useOnceCall(() => {
    reloadPage();
    console.log("called");
  });

  return (
    <>
      {subscribersData.status === "loading" ? (
        <Loader title="Subscribers" />
      ) : subscribersData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Check access to the data from airtable base."
          titleThree="Also, please check your internet connection."
        />
      ) : (
        <Container>
          {subscribersData.status === "success" &&
          !subscribersData.data.length ? (
            <Error
              titleOne="There are not subscribers added yet."
              titleTwo="Please add a new subscriber."
            />
          ) : (
            <>
              <StyledHeading label="Subscribers:" />

              <ContainerSubscribers
                subHeading="List:"
                dataHeadTable={generalDataHeadTable}
                subscribersData={subscribersData.data}
                setSelectedData={setSelectedData}
                handleSubscriberDetails={handleSubscriberDetails}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            </>
          )}

          {subscribersData.data.length > 1 ? (
            <ContainerSubscribers
              subHeading="Latest added Subscriber:"
              dataHeadTable={generalDataHeadTable}
              subscribersData={subscribersData.latestAddedItem}
              setSelectedData={setSelectedData}
              handleSubscriberDetails={handleSubscriberDetails}
              setContentPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ) : (
            ""
          )}
        </Container>
      )}
    </>
  );
};

export default SubscribersList;
