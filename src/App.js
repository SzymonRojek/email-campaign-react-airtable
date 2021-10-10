import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  useRoutes,
  useNavigate,
  Redirect,
} from "react-router-dom";

import {
  SubscribersList,
  NewEmailCampaign,
  EmailCampaignsList,
  FilterStatusEmail,
  Home,
  AddSubscriber,
  FilteredStatusSubscribers,
  SubscriberDetails,
} from "./pages";

import { Navigation } from "./components/Navigation/Navigation";
import { InfoPopup, ConfirmPopup } from "./components/Popup";
import api from "./api";
import {
  sortDataAlphabetically,
  capitalizeFirstLetter,
  setContentPopup,
} from "./helpers";
import handlers from "./helpers/handlers";

const Routing = () => {
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

  const emailDataLinksNavigation = [
    {
      to: "",
      exact: true,
      name: "Campaigns List",
    },
    {
      to: "filter",
      name: "Filter by status",
    },
    {
      to: "add-email",
      name: "New Campaign",
    },
  ];

  const subscribersDataLinksNavigation = [
    {
      to: "",
      exact: true,
      name: "Subscribers List",
    },
    {
      to: "filter",
      name: "Filter by status",
    },
    {
      to: "add-subscriber",
      name: "New Subscriber",
    },
  ];

  const mainNavigationLinksData = [
    { to: "/subscribers", name: "Subscribers" },
    { to: "/campaigns", name: "Email Campaigns" },
    { to: "/", exact: true, name: "Home" },
  ];

  const routes = [
    { path: "/", element: <Home /> },
    {
      path: "/subscribers",
      element: <Navigation dataLinks={subscribersDataLinksNavigation} />,
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
      element: <Navigation dataLinks={emailDataLinksNavigation} />,
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
        dataLinks={mainNavigationLinksData}
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

const App = () => (
  <Router>
    <Routing />
  </Router>
);

export default App;
