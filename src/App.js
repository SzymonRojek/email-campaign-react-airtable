import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  useRoutes,
  useNavigate,
} from "react-router-dom";

import {
  SubscribersList,
  CreateCampaign,
  ListCampaigns,
  Home,
  AddSubscriber,
  FilteredStatusSubscribers,
  SubscriberDetails,
} from "./pages";
// import { MainNavigation, SubscribersNavigation } from "./components/Navigation";

import { MainNavigation } from "./components/Navigation/MainNavigation";
import { SubscribersNavigation } from "./components/Navigation/SubscribersNavigation";
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
    handlers.handleRowClick(subscriber, navigate);
    setTextPopup(
      subscriber.fields.status,
      capitalizeFirstLetter(subscriber.fields.name),
      setContentPopup
    );
    handlers.handleOpenPopup(subscriber, setOpenInfoPopup);
  };

  const routes = [
    {
      path: "/subscribers",
      element: <SubscribersNavigation />,
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
          path: "/filtered-status",
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
              getData={getData}
              idClickedSubscriber={idClickedSubscriber}
            />
          ),
        },
      ],
    },
    { path: "/campaigns", element: <ListCampaigns /> },
    { path: "/new-campaign", element: <CreateCampaign /> },
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
