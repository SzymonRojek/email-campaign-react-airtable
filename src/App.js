import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  useRoutes,
  useNavigate,
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
import { MainNavigation } from "./components/Navigation/MainNavigation";
import { SubNavigation } from "./components/Navigation/SubNavigation";
import { InfoPopup, ConfirmPopup } from "./components/Popup";
import api from "./api";
import {
  sortDataAlphabetically,
  capitalizeFirstLetter,
  setTextPopup,
} from "./helpers";
import handlers from "./helpers/handlers";

const Routing = () => {
  const [subscribersData, setSubscribersData] = useState([]);
  const [openInfoPopup, setOpenInfoPopup] = useState(false);
  const [textContentPopup, setContentPopup] = useState({});
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
    setTextPopup(
      subscriber.fields.status,
      capitalizeFirstLetter(subscriber.fields.name),
      setContentPopup
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

  const routes = [
    {
      path: "/subscribers",
      element: (
        <SubNavigation dataLinksNavigation={subscribersDataLinksNavigation} />
      ),
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
              setContentPopup={setContentPopup}
              getData={getData}
            />
          ),
        },
        {
          path: "/filter",
          element: (
            <FilteredStatusSubscribers
              subscribersData={subscribersData}
              setContentPopup={setContentPopup}
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
              setContentPopup={setContentPopup}
            />
          ),
        },
      ],
    },
    {
      path: "/campaigns",
      element: <SubNavigation dataLinksNavigation={emailDataLinksNavigation} />,
      children: [
        { path: "", element: <EmailCampaignsList /> },
        { path: "/filter", element: <FilterStatusEmail /> },
        { path: "/add-email", element: <NewEmailCampaign /> },
      ],
    },

    { path: "/home", element: <Home /> },
  ];

  const routing = useRoutes(routes);

  return (
    <>
      <MainNavigation />

      <InfoPopup
        openInfoPopup={openInfoPopup}
        setOpenInfoPopup={setOpenInfoPopup}
        textContentPopup={textContentPopup}
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
