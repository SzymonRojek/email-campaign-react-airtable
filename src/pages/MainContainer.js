import { useEffect, useState } from "react";
import { useRoutes, useNavigate } from "react-router-dom";

import api from "../api";
import {
  SubscribersList,
  NewEmailCampaign,
  EmailCampaignsList,
  FilterStatusEmail,
  Home,
  AddSubscriber,
  FilteredStatusSubscribers,
  SubscriberDetails,
} from "./pagesApp";
import { Navigation } from "../components/Navigation";
import { InfoPopup, ConfirmPopup } from "../components/Popup";
import {
  sortDataAlphabetically,
  capitalizeFirstLetter,
  setContentPopup,
  getLatestAddedSubscriber,
} from "../helpers";
import {
  mainLinksNavigation,
  subscribersLinksNavigation,
  emailLinksNavigation,
} from "../data/dataLinksNavigation";

const MainContainer = () => {
  const navigate = useNavigate();
  const [subscribersData, setSubscribersData] = useState({
    status: "loading",
    data: null,
    latestSubscriber: null,
  });
  const [openInfoPopup, setOpenInfoPopup] = useState(false);
  const [contentInfoPopup, setContentInfoPopup] = useState({});
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [idClickedSubscriber, setIdClickedSubscriber] = useState(null);

  const endpoint = "/subscribers";

  const getData = async () => {
    try {
      const { records } = await api.get(endpoint);

      sortDataAlphabetically(records);
      setSubscribersData({
        status: "success",
        data: records,
        latestSubscriber: getLatestAddedSubscriber(records),
      });
    } catch (error) {
      setSubscribersData({
        status: "error",
      });
    }
  };

  useEffect(() => {
    const delayGetData = setTimeout(getData, 1500);

    return () => clearTimeout(delayGetData);
  }, []);

  const handleRemoveSubscriber = async () => {
    const idSubscriber = subscribersData.data.filter(
      (subscriber) => subscriber.id === idClickedSubscriber
    )[0].id;

    await api.delete(`/subscribers/${idSubscriber}`);

    getData();
    setOpenConfirmPopup(false);

    if (subscribersData.data.length === 0) setOpenInfoPopup(true);
  };

  const handleSubcriberDetailsOnClick = (subscriber) =>
    subscriber.fields.status === "active"
      ? navigate(`/subscribers/${subscriber.id}`)
      : "";

  const handleOpenPopup = (subscriber) =>
    subscriber.fields.status === "pending" ||
    subscriber.fields.status === "blocked"
      ? setOpenInfoPopup(true)
      : null;

  const handlePopup = (subscriber) => {
    handleSubcriberDetailsOnClick(subscriber);
    setContentPopup(
      subscriber.fields.status,
      capitalizeFirstLetter(subscriber.fields.name),
      setContentInfoPopup
    );
    handleOpenPopup(subscriber);
  };

  const routes = [
    { path: "/", element: <Home /> },
    {
      path: "/subscribers",
      element: <Navigation dataLinks={subscribersLinksNavigation} />,
      children: [
        {
          path: "/",
          element: (
            <SubscribersList
              subscribersData={subscribersData}
              setOpenInfoPopup={setOpenInfoPopup}
              setContentInfoPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
              handlePopup={handlePopup}
              setIdClickedSubscriber={setIdClickedSubscriber}
            />
          ),
        },
        {
          path: "/add-subscriber",
          element: (
            <AddSubscriber
              setOpenInfoPopup={setOpenInfoPopup}
              setContentInfoPopup={setContentInfoPopup}
              getData={getData}
            />
          ),
        },
        {
          path: "/filter",
          element: (
            <FilteredStatusSubscribers
              subscribersData={subscribersData}
              setContentInfoPopup={setContentInfoPopup}
              setOpenInfoPopup={setOpenInfoPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
              setIdClickedSubscriber={setIdClickedSubscriber}
              handlePopup={handlePopup}
            />
          ),
        },
        {
          path: "/:id",
          element: (
            <SubscriberDetails
              setOpenInfoPopup={setOpenInfoPopup}
              setContentInfoPopup={setContentInfoPopup}
            />
          ),
        },
      ],
    },
    {
      path: "/campaigns",
      element: <Navigation dataLinks={emailLinksNavigation} />,
      children: [
        { path: "", element: <EmailCampaignsList /> },
        { path: "/filter", element: <FilterStatusEmail /> },
        { path: "/add-email", element: <NewEmailCampaign /> },
      ],
    },
  ];

  const routing = useRoutes(routes);

  return (
    <>
      <Navigation
        className="header-container"
        dataLinks={mainLinksNavigation}
      />

      <InfoPopup
        openInfoPopup={openInfoPopup}
        setOpenInfoPopup={setOpenInfoPopup}
        contentInfoPopup={contentInfoPopup}
      />

      <ConfirmPopup
        openConfirmPopup={openConfirmPopup}
        setOpenConfirmPopup={setOpenConfirmPopup}
        idClickedSubscriber={idClickedSubscriber}
        setIdClickedSubscriber={setIdClickedSubscriber}
        removeSubscriber={handleRemoveSubscriber}
      />
      <div>{routing}</div>
    </>
  );
};

export default MainContainer;
