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
} from "../helpers";
import handlers from "../helpers/handlers";
import {
  mainLinksNavigation,
  subscribersLinksNavigation,
  emailLinksNavigation,
} from "../data/dataLinksNavigation";

const MainContainer = () => {
  const [subscribersData, setSubscribersData] = useState([]);
  const [openInfoPopup, setOpenInfoPopup] = useState(false);
  const [contentInfoPopup, setContentInfoPopup] = useState({});
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [idClickedSubscriber, setIdClickedSubscriber] = useState("");

  const navigate = useNavigate();

  const endpoint = "/subscribers";

  const getData = async () => {
    const data = await api.get(endpoint);

    sortDataAlphabetically(data.records);
    setSubscribersData(data.records);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleRemoveSubscriber = async () => {
    const idSubscriber = subscribersData.filter(
      (subscriber) => subscriber.id === idClickedSubscriber
    )[0].id;

    await api.delete(`/subscribers/${idSubscriber}`);

    getData();
    setOpenConfirmPopup(false);
  };

  const handlePopup = (subscriber) => {
    handlers.handleSubcriberDetailsClick(subscriber, navigate);
    setContentPopup(
      subscriber.fields.status,
      capitalizeFirstLetter(subscriber.fields.name),
      setContentInfoPopup
    );
    handlers.handleOpenPopup(subscriber, setOpenInfoPopup);
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
